module.exports = {
  name: 'prune',
  description: 'Delete "args" number of message',
  permissions: ['MANAGE_MESSAGES','READ_MESSAGE_HISTORY'],
  async execute(client, message, args, db) {
    if (isNaN(args[0]) || args[0] > 20 || args.length > 1) {
      message.channel.send("```!prune [any number <= 20]```");
    } else {
      await message.channel.bulkDelete(args[0]);
    };
  }
}


// this is async feature => add async in front of the execute function
