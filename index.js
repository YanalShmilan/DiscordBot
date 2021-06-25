const Discord = require("discord.js");
var http = require("http");
var fs = require("fs");
const dotenv = require("dotenv").config();
const Sequelize = require("sequelize");
const { Client, MessageAttachment } = require("discord.js");
const sequelize = new Sequelize("discord_db", "postgres", "123456", {
  host: "127.0.0.1",
  dialect: "postgres",
  logging: false,
});

let currentGroup = "JO21";
const Names = sequelize.define(
  "names",
  {
    name: {
      type: Sequelize.STRING,
    },
    group: {
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
    },
    prevI: {
      type: Sequelize.STRING,
    },
    prevP: {
      type: Sequelize.STRING,
    },
  },
  { createdAt: false, updatedAt: false }
);
Names.sync();

// add a name func
const add = async (name, type) => {
  try {
    const addName = await Names.create({
      name: name,
      type: type,
      absent: false,
      group: currentGroup,
    });
    // return message.reply(`Tag ${tag.name} added.`);
  } catch (e) {
    // return message.reply('Something went wrong with adding a tag.');
  }
};

const bulkAdd = async (names, type) => {
  try {
    names = names.split(",");
    names = names.map((name) => ({
      name: name,
      type: type,
      absent: false,
      group: currentGroup,
    }));
    const addNames = await Names.bulkCreate(names);
    // return message.reply(`Tag ${tag.name} added.`);
  } catch (e) {
    // return message.reply('Something went wrong with adding a tag.');
  }
};

// del func
const del = async (name) => {
  try {
    const findName = await Names.findOne({ where: { name: name } });
    const delName = await findName.destroy();
    // return message.reply(`Tag ${tag.name} added.`);
  } catch (e) {
    // return message.reply('Something went wrong with adding a tag.');
  }
};
// abs func
const abs = async (name) => {
  try {
    const findName = await Names.findOne({ where: { name: name } });
    findName.absent = true;
    const absName = await findName.update({ absent: true });
    // return message.reply(`Tag ${tag.name} added.`);
  } catch (e) {
    // return message.reply('Something went wrong with adding a tag.');
  }
};

const client = new Client();
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (msg.content.includes("!setGroup")) {
    currentGroup = msg.content.split("!setGroup ")[1];
    msg.reply("Current group now is :" + currentGroup);
  }
  // Attach
  else if (msg.content === "!wow") {
    const attachment = new MessageAttachment(
      "https://cdn140.picsart.com/308864669055201.gif?to=min&r=640"
    );
    msg.channel.send(attachment);
  }
});

// adding a student
client.on("message", (msg) => {
  if (msg.content.includes("!addStudent")) {
    const name = msg.content.split("!addStudent ")[1];
    add(name, "student");
    return msg.reply(`Student ${name} added.`);
  }
});
// adding an instructor
client.on("message", (msg) => {
  if (msg.content.includes("!addInstructor")) {
    const name = msg.content.split("!addInstructor ")[1];
    add(name, "instructors");
    return msg.reply(`Instructor ${name} added.`);
  }
});
// adding list of Students
client.on("message", (msg) => {
  if (msg.content.includes("!bulkStudents")) {
    const names = msg.content.split("!bulkStudents ")[1];
    bulkAdd(names, "student");
    return msg.reply(`Students added.`);
  }
});
// adding list of Instructors
client.on("message", (msg) => {
  if (msg.content.includes("!bulkInstructors")) {
    const names = msg.content.split("!bulkInstructors ")[1];
    bulkAdd(names, "instructors");
    return msg.reply(`Instructors added.`);
  }
});

// clearing the db
client.on("message", (msg) => {
  if (msg.content.includes("!clearDb")) {
    Names.sync({ force: true });
    return msg.reply(`Names cleard.`);
  }
});

// deleting a name
client.on("message", (msg) => {
  if (msg.content.includes("!removeName")) {
    const name = msg.content.split("!removeName ")[1];
    del(name);
    return msg.reply(`Name ${name} deleted.`);
  }
});
// absent a name
client.on("message", (msg) => {
  if (msg.content.includes("!absent")) {
    const name = msg.content.split("!absent ")[1];
    abs(name);
    return msg.reply(`Student ${name} Absent.`);
  }
});
// listing names
client.on("message", async (msg) => {
  if (msg.content.includes("!listNames")) {
    let names = await Names.findAll({
      attributes: ["name"],
    });
    names = names.map((name) => name.name);
    return msg.reply(`Names: ${names.toString()}.`);
  }
});

// creating pairs
client.on("message", async (msg) => {
  if (msg.content.includes("!pairs")) {
    let exculdeNames = msg.content.split("!pairs ")[1]
      ? msg.content.split("!pairs ")[1].split(",")
      : [];
    let currentNames = await Names.findAll({
      where: {
        type: "student",
        group: currentGroup,
      },
      order: [["id"]],
    });
    let shifts = +currentNames[0].prevP ?? 0;
    currentNames = currentNames.filter((a) => !exculdeNames.includes(a.name));
    await Names.update(
      { prevP: +shifts + 1 < currentNames.length ? shifts + 1 : 0 },
      {
        where: {
          group: currentGroup,
          type: "student",
        },
      }
    );
    let arr = [];
    for (let i = 0; i < currentNames.length; i++) arr.push(i);
    let reverseArr = [...arr].reverse();
    for (let i = 0; i < shifts - exculdeNames.length; i++) {
      reverseArr.unshift(reverseArr.pop());
    }

    let pairs = [];
    let lost = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === reverseArr[i]) lost.push(arr[i]);
      else {
        if (arr[i] > reverseArr[i]) pairs.push(arr[i] + "-" + reverseArr[i]);
        else pairs.push(reverseArr[i] + "-" + arr[i]);
      }
    }
    if (lost.length > 0) pairs.push(lost.join("-"));
    pairs = [...new Set(pairs)];
    let currentInstructor = await Names.findAll({
      where: {
        type: "instructors",
        group: currentGroup,
      },
      order: sequelize.random(),
    });
    console.log(exculdeNames);
    currentInstructor = currentInstructor
      .filter((a) => !exculdeNames.includes(a.name))
      .map((a) => [a.id, a.name, []]);
    for (let i = 0; i < pairs.length; i++) {
      currentInstructor[i % currentInstructor.length][2].push(pairs[i]);
    }
    currentInstructor.sort((a, b) => a[0] - b[0]);
    let counter = 1;
    currentInstructor = currentInstructor.map((array) => {
      let string = "```" + array[1] + "\n";
      array[2].forEach((pair) => {
        string +=
          "Pair " +
          counter +
          ": " +
          currentNames[+pair.split("-")[0]].name +
          (currentNames[+pair.split("-")[1]] === undefined
            ? ""
            : " - " + currentNames[+pair.split("-")[1]].name) +
          "\n";
        counter++;
      });
      string += "```";

      return string;
    });
    return msg.reply(currentInstructor);

    //console.log(pairsMap);
    // return `\`\`\` Pair ${i}: ${pair[0]} ${
    //   pair[1] ? `- ${pair[1]}` : ""
    // } \`\`\``;
  }
});

// creating Iod
client.on("message", async (msg) => {
  if (msg.content.includes("!iod")) {
    let exculdeNames = msg.content.split("!iod ")[1]
      ? msg.content.split("!iod ")[1].split(",")
      : [];

    let currentNames = await Names.findAll({
      where: {
        type: "student",
        group: currentGroup,
      },
      order: sequelize.random(),
    });
    let instructors = await Names.findAll({
      where: {
        type: "instructors",
        group: currentGroup,
      },
      order: sequelize.random(),
    });
    let result = "";
    console.log(+currentNames[0].prevI, instructors.length);
    instructors1 = instructors.filter((a) => !exculdeNames.includes(a.name));

    if (
      currentNames[0].prevI === null ||
      +currentNames[0].prevI >= instructors.length ||
      instructors1.length !== instructors.length
    ) {
      let CurrentShift = true;
      if (instructors1.length !== instructors.length) {
        instructors = instructors1;
        CurrentShift = false;
      }

      let iod = {};
      let iodName = {};
      instructors.forEach((i) => {
        iod[i.id] = [];
        iodName[i.id] = i.name;
      });

      for (let i = 0; i < currentNames.length; i++) {
        iod[instructors[i % instructors.length].id].push([
          currentNames[i].name,
          currentNames[i].id,
        ]);
      }
      for (const key in iod) {
        if (CurrentShift) {
          await Names.update(
            {
              prevI: iod[key].map((a) => a[1]).join(","),
            },
            {
              where: {
                id: +key,
              },
            }
          );
        }
        result += "```" + iodName[key] + "\n";
        result += iod[key]
          .map((a) => a[0])
          .filter((a) => !exculdeNames.includes(a))
          .join("\n");
        result += "```";

        console.log(iodName[key], iod[key]);
      }
      await Names.update(
        { prevI: CurrentShift ? 1 : +currentNames[0].prevI },
        {
          where: {
            type: "student",
            group: currentGroup,
          },
        }
      );
    } else {
      // 7,3,6,15,14
      instructors.sort((a, b) => a.id - b.id);
      let newiod = {};
      //console.log(instructors);
      for (let i = 0; i < instructors.length; i++) {
        let temp = +currentNames[0].prevI;
        newiod[instructors[i].name] =
          instructors[(i + temp) % instructors.length].prevI.split(",");
      }
      await Names.update(
        { prevI: +currentNames[0].prevI + 1 },
        {
          where: {
            type: "student",
            group: currentGroup,
          },
        }
      );
      console.log(exculdeNames);
      for (const key in newiod) {
        newiod[key] = newiod[key]
          .map((a) => currentNames.find((z) => +z.id === +a).name)
          .filter((a) => !exculdeNames.includes(a));

        result += "```" + key + "\n";
        result += newiod[key].join("\n");
        result += "```";
      }
    }

    return msg.reply(result);
  }
});
client.login(process.env.TOKEN);
