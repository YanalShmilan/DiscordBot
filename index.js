const Discord = require('discord.js');
var http = require('http');
var fs = require('fs');
const Sequelize = require('sequelize');
const { Client, MessageAttachment } = require('discord.js');
const sequelize = new Sequelize('discord_db', 'postgres', 'root', {
  host: '127.0.0.1',
  dialect: 'postgres',
  logging: false,
  // SQLite only
  //   storage: 'database.sqlite',
});
const Names = sequelize.define('names', {
  name: {
    type: Sequelize.STRING,
  },
});
Names.sync();
// add a name func
const add = async (name) => {
  try {
    const addName = await Names.create({
      name: name,
    });
    // return message.reply(`Tag ${tag.name} added.`);
  } catch (e) {
    // return message.reply('Something went wrong with adding a tag.');
  }
};
// add a list of names func
const bulkAdd = async (names) => {
  try {
    names = names.split(',');
    names = names.map((name) => ({ name: name }));
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

// const file = fs.createWriteStream('file.xlsx');

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

// adding a name
client.on('message', (msg) => {
  if (msg.content.includes('!addName')) {
    const name = msg.content.split('!addName ')[1];
    add(name);
    return msg.reply(`Name ${name} added.`);
  }
});
// adding list of names
client.on('message', (msg) => {
  if (msg.content.includes('!bulkAdd')) {
    const names = msg.content.split('!bulkAdd ')[1];
    bulkAdd(names);
    return msg.reply(`Names added.`);
  }
});
// adding list of names
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

    return msg.reply(` ${names.toString()}. `);
  }
});

// creating Iod
client.on('message', async (msg) => {
  if (msg.content.includes('!iod')) {
    let names = await Names.findAll({
      attributes: ['name'],
    });
    names = names.map((name) => name.name);
    names = names.sort((a, b) => 0.5 - Math.random());
    let result = [];
    for (let i = 3; i > 0; i--) {
      result.push(names.splice(0, Math.ceil(names.length / i)));
    }
    let zainab = result[0];
    let laila = result[1];
    let ahmad = result[2];
    laila = laila.map((name) => `\n ${name}`);
    zainab = zainab.map((name) => `\n ${name}`);
    ahmad = ahmad.map((name) => `\n ${name}`);

    // zainab = names.map((pair) => {
    //   return `\`\`\` \`\`\``;
    // });

    return msg.reply(
      ` \`\`\` Laila A : ${laila.toString()} \`\`\`  \`\`\` Zainab AlBaqasami : ${zainab}  \`\`\`  \`\`\` Ahmed AlKhunaizi : ${ahmad} \`\`\`   `
    );
  }
});

client.login('ODU3NTIxMjczNTAwNzI5MzU0.YNQy6w.XFWyudx6RXjz2nl9TGNgDyVNJW8');
