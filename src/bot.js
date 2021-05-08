// import libraries
require('dotenv').config();
const apiKeys = require('../config.json');
const { MONGODB_URI } = require('../config.json');
const mongoose = require('mongoose');
let knownServers = { servers: [] };
//import models
const GuildModel = require('./models/Guild');

// declare important variables
const fs = require('fs');
const util = require('util');
const QuickChart = require('quickchart-js');
const textToSpeech = require('@google-cloud/text-to-speech');
const fetch = require("node-fetch");
const api = apiKeys["openWeatherAPI"];
const alphaApi = apiKeys["alphaAPI"];
const cityData = require('../city.list.min.json');


//establish mongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => { console.log('Connected to Database!'); })
  .catch((err) => { console.log(`Error connecting database ${err}`); });
let db = mongoose.connection;
const guildModelWatcher = GuildModel.watch();
// watch for changes in Guild Model
guildModelWatcher.on('change', (change) => {
  // watching for changes => use id of changed document to reverify information w DB then change it locally (here)
  GuildModel.findOne({ _id: change.documentKey._id }, (err, res) => {
    if (err) {
      console.log("Error on finding ID of updated document: ", err);
    } else {
      console.log("result of updated document is: ", res);
      let resIndex = knownServers.servers.findIndex(server => server._id === res._id);
      knownServers.servers[resIndex] = res;
    };
  });
})
//discord client
const { Client } = require('discord.js');
const Discord = require('discord.js');

const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync(__dirname + '/commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  //once the bot online, it will run over all the servers it's in and then collect information neccessary to execute commands
  console.log(`${client.user.username} has logged in!`);
  let guildIDs = client.guilds.cache.map(guild => guild.id);
  guildIDs.map(guildID => {
    GuildModel.findOne({ _id: guildID }, (err, res) => {
      if (err) {
        console.log("error finding Guild ID", err);
      } else {
        if (res === null) {
          const doc = new GuildModel({ _id: guildID });
          doc.save();
          console.log("New Guild Created!");
        } else {
          knownServers.servers.push(res);
        }
      }
    });
  });
});

client.on('message', message => {
  // check if the incoming message was sent from the server in the list and does the message start with prefix of that server
  let result = knownServers.servers.find(server => server._id === message.guild.id);
  //check if message sent was a command or author is bot
  if (!message.content.startsWith(result.Prefix) || message.author.bot) return;
  // seperate command and args 
  const args = message.content.slice(result.Prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  // console.log(`command:${command}, arguments: ${args}`);
  try {
    client.commands.get(command).execute(client, message, args, db);
  } catch (error) {
    message.channel.send('Command not exist!');
  }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);