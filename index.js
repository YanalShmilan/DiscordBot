const Discord = require('discord.js');
var http = require('http');
var fs = require('fs');
const dotenv = require('dotenv').config();
const Sequelize = require('sequelize');
const { Client, MessageAttachment } = require('discord.js');
const sequelize = new Sequelize('discord_db', 'postgres', 'root', {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false,
});
const Names = sequelize.define('names', {
  name: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
  },
  prev: {
    type: Sequelize.STRING,
  },
  absent: {
    type: Sequelize.BOOLEAN,
  },
});
Names.sync();
// add a name func
const add = async (name, type) => {
  try {
    const addName = await Names.create({
      name: name,
      type: type,
      absent: false,
    });
    // return message.reply(`Tag ${tag.name} added.`);
  } catch (e) {
    // return message.reply('Something went wrong with adding a tag.');
  }
};
// add a list of names func
const bulkAdd = async (names, type) => {
  try {
    names = names.split(',');
    names = names.map((name) => ({ name: name, type: type, absent: false }));
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
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
});

client.on('message', (message) => {
  // If the message is '!rip'
  if (message.content === '!wow') {
    // Create the attachment using MessageAttachment
    const attachment = new MessageAttachment(
      'https://cdn140.picsart.com/308864669055201.gif?to=min&r=640'
    );
    // Send the attachment in the message channel
    message.channel.send(attachment);
  }
});

// adding a student
client.on('message', (msg) => {
  if (msg.content.includes('!addStudent')) {
    const name = msg.content.split('!addStudent ')[1];
    add(name, 'student');
    return msg.reply(`Student ${name} added.`);
  }
});
// adding an instructor
client.on('message', (msg) => {
  if (msg.content.includes('!addInstructor')) {
    const name = msg.content.split('!addInstructor ')[1];
    add(name, 'instructors');
    return msg.reply(`Instructor ${name} added.`);
  }
});
// adding list of Students
client.on('message', (msg) => {
  if (msg.content.includes('!bulkStudents')) {
    const names = msg.content.split('!bulkStudents ')[1];
    bulkAdd(names, 'student');
    return msg.reply(`Students added.`);
  }
});
// adding list of Instructors
client.on('message', (msg) => {
  if (msg.content.includes('!bulkInstructors')) {
    const names = msg.content.split('!bulkInstructors ')[1];
    bulkAdd(names, 'instructors');
    return msg.reply(`Instructors added.`);
  }
});

// clearing the db
client.on('message', (msg) => {
  if (msg.content.includes('!clearDb')) {
    Names.sync({ force: true });
    return msg.reply(`Names cleard.`);
  }
});

// deleting a name
client.on('message', (msg) => {
  if (msg.content.includes('!removeName')) {
    const name = msg.content.split('!removeName ')[1];
    del(name);
    return msg.reply(`Name ${name} deleted.`);
  }
});
// absent a name
client.on('message', (msg) => {
  if (msg.content.includes('!absent')) {
    const name = msg.content.split('!absent ')[1];
    abs(name);
    return msg.reply(`Student ${name} Absent.`);
  }
});
// listing names
client.on('message', async (msg) => {
  if (msg.content.includes('!listNames')) {
    let names = await Names.findAll({
      attributes: ['name'],
    });
    names = names.map((name) => name.name);
    return msg.reply(`Names: ${names.toString()}.`);
  }
});

// creating pairs
client.on('message', async (msg) => {
  if (msg.content.includes('!pairs')) {
    let names = await Names.findAll({
      attributes: ['name'],
      where: {
        type: 'student',
        absent: false,
      },
    });
    names = names.map((name) => name.name);
    names = names.sort((a, b) => 0.5 - Math.random());
    names = names.reduce(function (result, value, index, array) {
      if (index % 2 === 0) result.push(array.slice(index, index + 2));
      return result;
    }, []);
    let i = 0;
    names = names.map((pair) => {
      i++;

      return `\`\`\` Pair ${i}: ${pair[0]} ${
        pair[1] ? `- ${pair[1]}` : ''
      } \`\`\``;
    });

    return msg.reply(` ${names.join(' ')} `);
  }
});

// creating Iod
client.on('message', async (msg) => {
  if (msg.content.includes('!iod')) {
    let fullNames = await Names.findAll({
      attributes: ['name', 'prev'],
      where: {
        type: 'student',
        absent: false,
      },
      order: sequelize.random(),
    });
    let instructors = await Names.findAll({
      attributes: ['name'],
      where: {
        type: 'instructors',
      },
    });

    names = fullNames.map((name) => name.name);
    instructors = instructors.map((name) => name.name);
    const tempStudent = await Names.findOne({
      where: {
        type: 'student',
      },
    });
    let result = [];
    let instructorsMap = {};
    instructors.forEach((ins) => (instructorsMap[ins] = []));
    if (
      tempStudent.prev === null ||
      tempStudent.prev.split(',').length === instructors.length
    ) {
      for (let i = instructors.length; i > 0; i--) {
        result.push(names.splice(0, Math.ceil(names.length / i)));
      }
      let x = -1;
      const allIns = [];
      instructors = await instructors.map(async (ins) => {
        x++;
        result[x] = await result[x]
          .map(async (name) => {
            nameToUpdate = await Names.findOne({
              where: {
                name: name,
              },
            });

            await nameToUpdate.update({ prev: ins });

            return name;
          })
          .join(' ');
        console.log(result[x]);

        allIns.push(await result[x]);

        // return result[x];
      });
      console.log(allIns);
      return msg.reply(allIns);
    } else {
      fullNames.forEach(async (name) => {
        const insList = name.prev.split(',');

        const detectIns = instructors.indexOf(insList[insList.length - 1]);

        instructorsMap[instructors[(detectIns + 1) % instructors.length]] = [
          ...instructorsMap[instructors[(detectIns + 1) % instructors.length]],
          name.name,
        ];

        const nameToUpdate = await Names.findOne({
          where: {
            name: name.name,
          },
        });

        await nameToUpdate.update({
          prev:
            nameToUpdate.prev +
            ',' +
            instructors[(detectIns + 1) % instructors.length],
        });
      });
    }

    // return msg.reply(" ```   ``` ");
  }
});
client.login(process.env.TOKEN);
