const Discord = require('discord.js');
const express = require('express');
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');
app.use(cors());
app.use(express.json());
app.listen(process.env.PORT || 5000);
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});
var http = require('http');
var fs = require('fs');
const dotenv = require('dotenv').config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var emojiStrip = require('emoji-strip');
var pg = require('pg');
pg.defaults.ssl = true;
const { Client, MessageAttachment } = require('discord.js');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // <<<<<<< YOU NEED THIS
    },
  },
}); // Example for postgres

const nodeHtmlToImage = require('node-html-to-image');
const { group } = require('console');

let currentGroup;
const Names = sequelize.define(
  'names',
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
    names = names.split(',');
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
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', async (msg) => {
  // if (msg.content.includes("!setGroup")) {
  //   currentGroup = msg.content.split("!setGroup ")[1];
  //   msg.reply("Current group now is :" + currentGroup);
  // }
  if (msg.author.bot) return;
  currentGroup = emojiStrip(msg.channel.name.split('-')[0].toUpperCase());

  console.log(currentGroup);
  if (msg.content === '!clear') {
  } else if (msg.content === '!wow') {
    const attachment = new MessageAttachment(
      'https://cdn140.picsart.com/308864669055201.gif?to=min&r=640'
    );
    msg.channel.send(attachment);
  } else if (msg.content.includes('!laila')) {
    msg.reply('Is the best instructor');
  }
  // Attach
  else if (msg.content === '!zainab') {
    msg.reply('Zeinab*');
  } else if (msg.content === '!ahmad') {
    msg.reply(
      'You are using an old version please run the command !updateAhmad to upgrade'
    );
  } else if (msg.content === '!updateAhmad') {
    msg.reply('Ahmad 1.0 is the best');
  } else if (msg.content === '!hajar') {
    msg.reply('We miss you');
  } else if (msg.content === '!ibrahim') {
    msg.reply('Did you mean العندليب؟');
  } else if (msg.content === '!ismael') {
    msg.reply(
      new MessageAttachment(
        'https://www.shorouknews.com/uploadedimages/Other/original/ghnjgchgjghj.jpg'
      )
    );
  } else if (msg.content === '!yanal') {
    msg.reply(':hatching_chick:');
  } else if (msg.content === '!esraa') {
    msg.reply('ليلى بتتخوتي ؟');
  } else if (msg.content === '!mohammad') {
    msg.reply("```for(int i;i<array.length;i++) array.push(''); ```");
  } else if (msg.content === '!helpMe') {
    const helpMsg1 = ` \`\`\`  
    Welcome to Ahmad2.0 Discord Bot, made in inhuman conditions under the supervision of Laila A to help you generate 
    Instructor of the day and Pairs for your students. \n \`\`\`  `;
    const helpMsg2 = ` \`\`\` 
    Commands:
    // To add a single student : !addStudent firstName lastName 
    ## !addStudent Ahmad Mohammad ## 
    // To add a list of students at once seprated by a comma : !bulkStudents firstName lastName,firstName2 lastName2 
    ## !bulkStudents Ahmad Mohammad,Zaid Mahmoud ## 
    // To add a single Instructor : !addInstructor firstName lastName 
    ## !addInstructor Ahmed AlKhunaizi ## 
    // To add a list of instructors at once seprated by a comma : !bulkInstructors firstName lastName,firstName2 lastName2 
    ## !bulkInstructors Ahmed AlKhunaizi,Zainab AlBaqsami ## 
    \`\`\` `;
    const helpMsg3 = ` \`\`\` 
    // To delete a student or an instructor from the database : !removeName firstName lastName  
    ## !removeName Ahmed AlKhunaizi ## 
    // To list all names in the database : !listNames 
    ## !listNames ## 
    // To delete all names at once from the database : !clearDb 
    ## !clearDb ## 
    \`\`\` `;
    const helpMsg4 = ` \`\`\` 
    // To generete pairs from the list of students in the database assigning each pair to an instructor : !pairs  
    ## !pairs ## 
    // To generete pairs excluding an absent student or an instructor seperated by a comma : !pairs firstName lastName,firstName LastName 
    ## !pairs Ahmed AlKhunaizi,Zaid Mahmoud ## 
    // To generete Instructors of the day assigning each group of students to an instructor : !iod
    ## !iod ## 
    // To generete Instructors of the day excluding an absent student or an instructor seperated by a comma : !iod firstName lastName,firstName LastName 
    ## !iod Ahmed AlKhunaizi,Zaid Mahmoud ## 
    \`\`\` `;
    const helpMsg5 = ` \`\`\` 
    General informations:
    1- The Bot will only answer discord accounts with the role "Instructor".
    2- The Bot will recognise the bootcamp students and instructors from the channel name, ex: Jo21-discussions, *will generate pairs and iods for Jo21 instructors and students*. 
    3- Each student will be paird with each other student before he gets paired with the same student again.
    4- Each student will be assigned to each instructor before he gets assigned to the same instructor again. 
    \`\`\` `;
    const helpMsg6 = ` \`\`\` 
    Made by Yanal Shmilan and Mohammad AlHadidi - 2021.
    In the memory of Jo21 cohort:
    Instructors: Laila AlKandery,Zainab AlBaqasami,Hajar AlGhannami,Ahmed AlKhunaizi
    Students: 
    Abdullah Bader,Ahmad Abu Awad,Ahmad Abu-Daoud,Ali Ighrayyeb,
    Amjed Almuhtaseb,Aya Abdulqader,Aya Alhusamia,Basel Abu Tarboosh,
    Dina Isbaih,Esra'a Al-malkawi,Hayder Abdulsahib,Ibraheem Shahin,
    Ismail Alomari,Iyas Al-owaneh,Mohammad AlHadidi,Omar Alhawamdeh,
    Wafaa Abdallah,Yanal Shmilan,Yousef Laban,Zied Jalajel
    \`\`\` `;
    msg.channel.send(helpMsg1);
    msg.channel.send(helpMsg2);
    msg.channel.send(helpMsg3);
    msg.channel.send(helpMsg4);
    msg.channel.send(helpMsg5);

    return msg.channel.send(helpMsg6);
  }
  if (
    !msg.member.roles.cache.some((role) => role.name === 'Instructor') &&
    msg.author.id !== '262688213024374794' &&
    msg.author.id !== '413822765259423765'
  )
    return;

  if (msg.content.includes('!addStudent')) {
    const name = msg.content.split('!addStudent ')[1];
    add(name, 'student');
    return msg.reply(`Student ${name} added.`);
  } else if (msg.content.includes('!addInstructor')) {
    const name = msg.content.split('!addInstructor ')[1];
    add(name, 'instructors');
    return msg.reply(`Instructor ${name} Added`);
  } else if (msg.content.includes('!bulkStudents')) {
    const names = msg.content.split('!bulkStudents ')[1];
    bulkAdd(names, 'student');
    return msg.reply(`Students added.`);
  } else if (msg.content.includes('!bulkInstructors')) {
    const names = msg.content.split('!bulkInstructors ')[1];
    bulkAdd(names, 'instructors');
    return msg.reply(`Instructors added.`);
  } else if (msg.content.includes('!clearDb')) {
    Names.sync({ force: true });
    return msg.reply(`Names cleard.`);
  } else if (msg.content.includes('!removeName')) {
    const name = msg.content.split('!removeName ')[1];
    del(name);
    return msg.reply(`Name ${name} deleted.`);
  } else if (msg.content.includes('!imagetest')) {
    nodeHtmlToImage({
      output: './image.png',
      html: `<html>
      <head>
        <style>
          body {
            width: 480px;
            height: 480px;
          }
        </style>
      </head>
      <body>
      <table>
        <tr>
          <td>Laila </td>
          <td>Ahmad </td>
          <td>Zaineb </td>
        </tr>
      </table></body>
    </html>
    `,
      puppeteerArgs: { args: ['--no-sandbox'] },
    }).then(() => {
      console.log('The image was created successfully!');
      msg.reply(new MessageAttachment('./image.png'));
    });
    return;
  } else if (msg.content.includes('!listNames')) {
    let names = await Names.findAll({
      attributes: ['name'],
    });
    names = names.map((name) => name.name);
    return msg.reply('```Names: \n' + names.join('\n') + '```');
  } else if (msg.content.includes('!pairs')) {
    let exculdeNames = msg.content.split('!pairs ')[1]
      ? msg.content.split('!pairs ')[1].split(',')
      : [];
    let currentNames = await Names.findAll({
      where: {
        type: 'student',
        group: currentGroup,
      },
      order: [['id']],
    });
    let shifts = +currentNames[0].prevP ?? 0;
    currentNames = currentNames.filter((a) => !exculdeNames.includes(a.name));
    await Names.update(
      { prevP: +shifts + 1 < currentNames.length ? shifts + 1 : 0 },
      {
        where: {
          group: currentGroup,
          type: 'student',
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
        if (arr[i] > reverseArr[i]) pairs.push(arr[i] + '-' + reverseArr[i]);
        else pairs.push(reverseArr[i] + '-' + arr[i]);
      }
    }
    if (lost.length > 0) pairs.push(lost.join('-'));
    pairs = [...new Set(pairs)];
    let currentInstructor = await Names.findAll({
      where: {
        type: 'instructors',
        group: currentGroup,
      },
      order: sequelize.random(),
    });
    //console.log(exculdeNames);
    currentInstructor = currentInstructor
      .filter((a) => !exculdeNames.includes(a.name))
      .map((a) => [a.id, a.name, []]);
    for (let i = 0; i < pairs.length; i++) {
      currentInstructor[i % currentInstructor.length][2].push(pairs[i]);
    }
    currentInstructor.sort((a, b) => a[0] - b[0]);
    let counter = 1;
    let thArray = [];
    let tableBody = [];
    for (let i = 0; i < pairs.length / currentInstructor.length; i++) {
      tableBody.push([]);
    }
    let max = 0;
    for (let i = 0; i < currentInstructor.length; i++) {
      max = Math.max(currentInstructor[i][2].length, max);
    }
    let fakecounter = 0;
    currentInstructor = currentInstructor.map((array) => {
      let string = '```' + array[1] + '\n';
      if (array[2].length < max) array[2].push('');
      thArray.push(array[1]);
      array[2].forEach((pair) => {
        tableBody[(counter - 1) % tableBody.length].push(
          (pair === ''
            ? fakecounter++
              ? ''
              : ''
            : "<small style='color:grey'>Pair (" +
              (counter - fakecounter) +
              ')</small> ' +
              '<br> ' +
              currentNames[+pair.split('-')[0]].name) +
            (currentNames[+pair.split('-')[1]] === undefined
              ? '<br>'
              : ' <br> ' + currentNames[+pair.split('-')[1]].name)
        );
        string +=
          'Pair ' +
          counter +
          ': ' +
          (pair === '' ? '' : currentNames[+pair.split('-')[0]].name) +
          (currentNames[+pair.split('-')[1]] === undefined
            ? ''
            : ' - ' + currentNames[+pair.split('-')[1]].name) +
          '\n';
        counter++;
      });
      string += '```';
      return string;
    });
    thArray = thArray.map((a) => '<td>' + a.split(' ')[0] + '</td>');
    tableBody = tableBody.map((a) => '<td>' + a.join('</td><td>') + '</td>');
    nodeHtmlToImage({
      output: './image.png',
      html: `<html>
      <head>
        <style>
          body {
            width: 700px;
            height: ${-1 + tableBody.length * 90}px;
            background-color:#2F3136;
          }
          .styled-table {
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            width: 700px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            background-color:#FFFFFF;
        }
        .styled-table thead tr {
          background-color: #17243D;
          color: #ffffff;
          text-align: left;
      }
      .styled-table th,
.styled-table td {
  padding: 12px 15px;
}

          .styled-table tbody tr {
            border-bottom: 1px solid #dddddd;
        }
        
        .styled-table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }
        
        .styled-table tbody tr:last-of-type {
            border-bottom: 2px solid #17243D;
        }

        </style>
      </head>
      <body>
      <center>
      <table class="styled-table">
      <thead>
        <tr>
        ${thArray.join('')}
        </tr>
        </thead>
        <tbody>
        <tr>
        ${tableBody.join('</tr><tr>')}
        </tr>
        </tbody>
      </table>
      </center>
      </body>
      
    </html>
    `,
      puppeteerArgs: { args: ['--no-sandbox'] },
    }).then(() => {
      const exampleEmbed = new Discord.MessageEmbed()

        .setColor('#17243D')
        .setTitle('Pairs')
        .setURL('https://www.joincoded.com/')
        .setAuthor(
          'COODED ' + currentGroup,
          'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA',
          'https://www.joincoded.com/'
        )
        .setThumbnail(
          'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
        )
        .setImage(
          'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
        )
        .setTimestamp()
        .attachFiles(['./image.png'])
        .setImage('attachment://image.png');
      return msg.reply(exampleEmbed);
    });
    //return msg.reply(currentInstructor);

    //console.log(pairsMap);
    // return `\`\`\` Pair ${i}: ${pair[0]} ${
    //   pair[1] ? `- ${pair[1]}` : ""
    // } \`\`\``;
  } else if (msg.content.includes('!mypairs')) {
    let currentNames = await Names.findAll({
      where: {
        type: 'student',
        group: currentGroup,
      },
      order: [['id']],
    });
    const FindName = (myname) => {
      let currentName = currentNames.find((a) =>
        a.name.toLowerCase().startsWith(myname.toLowerCase())
      );
      if (currentName) return currentName.name;
      else return myname + '*';
    };
    let exculdeNames = [];
    pairs = msg.content.split('!mypairs ')[1]
      ? msg.content.split('!mypairs ')[1].split(',')
      : [];
    pairs = [...new Set(pairs)];
    let currentInstructor = await Names.findAll({
      where: {
        type: 'instructors',
        group: currentGroup,
      },
      order: sequelize.random(),
    });
    //console.log(exculdeNames);
    currentInstructor = currentInstructor
      .filter((a) => !exculdeNames.includes(a.name))
      .map((a) => [a.id, a.name, []]);
    for (let i = 0; i < pairs.length; i++) {
      currentInstructor[i % currentInstructor.length][2].push(pairs[i]);
    }
    currentInstructor.sort((a, b) => a[0] - b[0]);
    let counter = 1;
    let thArray = [];
    let tableBody = [];
    for (let i = 0; i < pairs.length / currentInstructor.length; i++) {
      tableBody.push([]);
    }
    let max = 0;
    for (let i = 0; i < currentInstructor.length; i++) {
      max = Math.max(currentInstructor[i][2].length, max);
    }
    let fakecounter = 0;
    currentInstructor = currentInstructor.map((array) => {
      let string = '```' + array[1] + '\n';
      if (array[2].length < max) array[2].push('');
      thArray.push(array[1]);
      array[2].forEach((pair) => {
        tableBody[(counter - 1) % tableBody.length].push(
          (pair === ''
            ? fakecounter++
              ? ''
              : ''
            : "<small style='color:grey'>Pair (" +
              (counter - fakecounter) +
              ')</small> ' +
              '<br> ' +
              FindName(pair.split('-')[0])) +
            (pair.split('-')[1] === undefined
              ? '<br>'
              : ' <br> ' + FindName(pair.split('-')[1]))
        );
        // string +=
        //   "Pair " +
        //   counter +
        //   ": " +
        //   (pair === "" ? "" : currentNames[+pair.split("-")[0]].name) +
        //   (currentNames[+pair.split("-")[1]] === undefined
        //     ? ""
        //     : " - " + currentNames[+pair.split("-")[1]].name) +
        //   "\n";
        counter++;
      });
      string += '```';
      return string;
    });
    thArray = thArray.map((a) => '<td>' + a.split(' ')[0] + '</td>');
    tableBody = tableBody.map((a) => '<td>' + a.join('</td><td>') + '</td>');
    nodeHtmlToImage({
      output: './image.png',
      html: `<html>
      <head>
        <style>
          body {
            width: 700px;
            height: ${
              (tableBody.length === 1 ? 30 : 10) + tableBody.length * 90
            }px;
            background-color:#2F3136;
          }
          .styled-table {
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            width: 700px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            background-color:#FFFFFF;
        }
        .styled-table thead tr {
          background-color: #17243D;
          color: #ffffff;
          text-align: left;
      }
      .styled-table th,
.styled-table td {
  padding: 12px 15px;
}

          .styled-table tbody tr {
            border-bottom: 1px solid #dddddd;
        }
        
        .styled-table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }
        
        .styled-table tbody tr:last-of-type {
            border-bottom: 2px solid #17243D;
        }

        </style>
      </head>
      <body>
      <center>
      <table class="styled-table">
      <thead>
        <tr>
        ${thArray.join('')}
        </tr>
        </thead>
        <tbody>
        <tr>
        ${tableBody.join('</tr><tr>')}
        </tr>
        </tbody>
      </table>
      </center>
      </body>
      
    </html>
    `,
      puppeteerArgs: { args: ['--no-sandbox'] },
    }).then(() => {
      const exampleEmbed = new Discord.MessageEmbed()

        .setColor('#17243D')
        .setTitle('Pairs')
        .setURL('https://www.joincoded.com/')
        .setAuthor(
          'COODED ' + currentGroup,
          'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA',
          'https://www.joincoded.com/'
        )
        .setThumbnail(
          'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
        )
        .setImage(
          'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
        )
        .setTimestamp()
        .attachFiles(['./image.png'])
        .setImage('attachment://image.png');
      return msg.reply(exampleEmbed);
    });
    //return msg.reply(currentInstructor);

    //console.log(pairsMap);
    // return `\`\`\` Pair ${i}: ${pair[0]} ${
    //   pair[1] ? `- ${pair[1]}` : ""
    // } \`\`\``;
  } else if (msg.content.includes('!iod')) {
    let thArray = [];
    let tableBody = [];
    let exculdeNames = msg.content.split('!iod ')[1]
      ? msg.content.split('!iod ')[1].split(',')
      : [];

    let currentNames = await Names.findAll({
      where: {
        type: 'student',
        group: currentGroup,
      },
      order: sequelize.random(),
    });
    let instructors = await Names.findAll({
      where: {
        type: 'instructors',
        group: currentGroup,
      },
      order: sequelize.random(),
    });
    let result = '';
    //console.log(+currentNames[0].prevI, instructors.length);
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

      for (let i = 0; i < currentNames.length / instructors.length; i++) {
        tableBody.push([]);
      }
      let max = 0;
      for (const key in iod) {
        max = Math.max(iod[key].length, max);
      }
      for (const key in iod) {
        if (CurrentShift) {
          await Names.update(
            {
              prevI: iod[key].map((a) => a[1]).join(','),
            },
            {
              where: {
                id: +key,
              },
            }
          );
        }
        iod[key] = iod[key]
          .map((a) => a[0])
          .filter((a) => !exculdeNames.includes(a));

        if (iod[key].length !== max) iod[key].push('');

        result += '```' + iodName[key] + '\n';
        result += iod[key].join('\n');
        result += '```';
        thArray.push(iodName[key]);
        let count = 0;
        iod[key].forEach((studentName) => {
          tableBody[count % tableBody.length].push(studentName);
          count++;
        });
      }
      await Names.update(
        { prevI: CurrentShift ? 1 : +currentNames[0].prevI },
        {
          where: {
            type: 'student',
            group: currentGroup,
          },
        }
      );

      thArray = thArray.map((a) => '<td>' + a.split(' ')[0] + '</td>');
      tableBody = tableBody.map((a) => '<td>' + a.join('</td><td>') + '</td>');

      nodeHtmlToImage({
        output: './image.png',
        html: `<html>
      <head>
        <style>
          body {
            width: 700px;
            height: ${-1 + tableBody.length * 50}px;
            background-color:#2F3136;
          }
          .styled-table {
            border-collapse: collapse;
            margin: 25px 0;
            font-size: 0.9em;
            font-family: sans-serif;
            width: 700px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            background-color:#FFFFFF;
        }
        .styled-table thead tr {
          background-color: #17243D;
          color: #ffffff;
          text-align: left;
      }
      .styled-table th,
.styled-table td {
  padding: 12px 15px;
}

          .styled-table tbody tr {
            border-bottom: 1px solid #dddddd;
        }
        
        .styled-table tbody tr:nth-of-type(even) {
            background-color: #f3f3f3;
        }
        
        .styled-table tbody tr:last-of-type {
            border-bottom: 2px solid #17243D;
        }

        </style>
      </head>
      <body>
      <center>
      <table class="styled-table">
      <thead>
        <tr>
        ${thArray.join('')}
        </tr>
        </thead>
        <tbody>
        <tr>
        ${tableBody.join('</tr><tr>')}
        </tr>
        </tbody>
      </table>
      </center>
      </body>
      
    </html>
    `,
        puppeteerArgs: { args: ['--no-sandbox'] },
      }).then(() => {
        const exampleEmbed = new Discord.MessageEmbed()

          .setColor('#17243D')
          .setTitle('Instructors of the Day')
          .setURL('https://www.joincoded.com/')
          .setAuthor(
            'COODED ' + currentGroup,
            'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA',
            'https://www.joincoded.com/'
          )
          .setThumbnail(
            'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
          )
          .setImage(
            'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
          )
          .setTimestamp()
          .attachFiles(['./image.png'])
          .setImage('attachment://image.png');
        return msg.reply(exampleEmbed);
      });
    } else {
      // 7,3,6,15,14
      instructors.sort((a, b) => a.id - b.id);
      let newiod = {};
      //console.log(instructors);
      for (let i = 0; i < instructors.length; i++) {
        let temp = +currentNames[0].prevI;
        newiod[instructors[i].name] =
          instructors[(i + temp) % instructors.length].prevI.split(',');
      }
      await Names.update(
        { prevI: +currentNames[0].prevI + 1 },
        {
          where: {
            type: 'student',
            group: currentGroup,
          },
        }
      );
      let thArray = [];
      let tableBody = [];
      for (let i = 0; i < currentNames.length / instructors.length; i++) {
        tableBody.push([]);
      }
      let max = 0;
      for (const key in newiod) {
        max = Math.max(newiod[key].length, max);
      }
      for (const key in newiod) {
        newiod[key] = newiod[key]
          .map((a) => currentNames.find((z) => +z.id === +a).name)
          .filter((a) => !exculdeNames.includes(a));
        if (newiod[key].length !== max) newiod[key].push('');
        thArray.push(key);
        count = 0;
        newiod[key].forEach((studentName) => {
          tableBody[count % tableBody.length].push(studentName);
          count++;
        });
        result += '```' + key + '\n';
        result += newiod[key].join('\n');
        result += '```';
      }
      //#009879

      thArray = thArray.map((a) => '<td>' + a.split(' ')[0] + '</td>');
      tableBody = tableBody.map((a) => '<td>' + a.join('</td><td>') + '</td>');

      nodeHtmlToImage({
        output: './image.png',
        html: `<html>
        <head>
          <style>
            body {
              width: 700px;
              height: ${-1 + tableBody.length * 50}px;
              background-color:#2F3136;
            }
            .styled-table {
              border-collapse: collapse;
              margin: 25px 0;
              font-size: 0.9em;
              font-family: sans-serif;
              width: 700px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
              background-color:#FFFFFF;
          }
          .styled-table thead tr {
            background-color: #17243D;
            color: #ffffff;
            text-align: left;
        }
        .styled-table th,
  .styled-table td {
    padding: 12px 15px;
  }
  
            .styled-table tbody tr {
              border-bottom: 1px solid #dddddd;
          }
          
          .styled-table tbody tr:nth-of-type(even) {
              background-color: #f3f3f3;
          }
          
          .styled-table tbody tr:last-of-type {
              border-bottom: 2px solid #17243D;
          }
  
          </style>
        </head>
        <body>
        <center>
        <table class="styled-table">
        <thead>
          <tr>
          ${thArray.join('')}
          </tr>
          </thead>
          <tbody>
          <tr>
          ${tableBody.join('</tr><tr>')}
          </tr>
          </tbody>
        </table>
        </center>
        </body>
        
      </html>
      `,
        puppeteerArgs: { args: ['--no-sandbox'] },
      }).then(() => {
        const exampleEmbed = new Discord.MessageEmbed()

          .setColor('#17243D')
          .setTitle('Instructors of the Day')
          .setURL('https://www.joincoded.com/')
          .setAuthor(
            'COODED ' + currentGroup,
            'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA',
            'https://www.joincoded.com/'
          )
          .setThumbnail(
            'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
          )
          .setImage(
            'https://media-exp1.licdn.com/dms/image/C4D0BAQHLyZXsUy3iaw/company-logo_200_200/0/1543400549551?e=2159024400&v=beta&t=7eYjtPJHw3cORsm2jWJNWQ3Ee9EpZG0VmLsPgODpvAA'
          )
          .setTimestamp()
          .attachFiles(['./image.png'])
          .setImage('attachment://image.png');
        return msg.reply(exampleEmbed);
      });
    }
  }
});
client.on('message', async (msg) => {
  if (msg.author.bot) return;
});
client.login(process.env.TOKEN);
