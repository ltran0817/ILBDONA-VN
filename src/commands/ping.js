module.exports = {
  name: 'ping',
  description: 'test connection',
  execute(client, message, args, db) {
    message.channel.send('pong');
  }
}