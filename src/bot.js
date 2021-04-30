// import libraries
require('dotenv').config();
const { prefix } = require('../config.json');
const apiKeys = require('../config.json');
// declare important variables
const fs = require('fs');
const util = require('util');
const QuickChart = require('quickchart-js');
const textToSpeech = require('@google-cloud/text-to-speech');
const fetch = require("node-fetch");
const api = apiKeys["openWeatherAPI"];
const alphaApi = apiKeys["alphaAPI"];
const cityData = require('../city.list.min.json');
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
  console.log(`${client.user.username} has logged in!`);
})

client.on('message', message => {
  //check if message sent was a command or author is bot
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  // seperate command and args 
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  // console.log(`command:${command}, arguments: ${args}`);
  try {
    client.commands.get(command).execute(client, message, args);
  } catch (error) {
    message.channel.send('Command not exist!');
  }
})
//
client.login(process.env.DISCORDJS_BOT_TOKEN);