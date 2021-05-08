const GuildModel = require('../models/Guild');

module.exports = {
  name: 'set_prefix',
  description: 'set Prefix for current server',
  execute(client, message, args, db) {
    GuildModel.findOneAndUpdate({ _id: message.guild.id }, { $set: { Prefix: args[0] } }, { new: true }, (err, res) => {
      if (err) { console.log("err updating prefix: ", err) };
    });
    message.channel.send(`Prefix of this server updated to: ${args[0]}`);
  }
}