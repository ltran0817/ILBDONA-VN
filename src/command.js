// import prefix
const { prefix } = require('../config.json');

//specify which command users trying to use
module.exports = (client, aliases, callback) => {
  //command part
  if (typeof aliases === 'string') {
    aliases = [aliases];
  }

  client.on('message', message => {
    if (message.author.bot) { return; }
    const { content } = message;

    aliases.forEach(alias => {
      const command = `${prefix}${alias}`
      if (content.startsWith(`${command} `) || content === command) {
        console.log(`Command ${command} requested!`);
        callback(message);
      }
    });
  })
}