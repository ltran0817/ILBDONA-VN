module.exports = {
  name: 'ping',
  description: 'test connection',
  execute(client, message, args) {
    message.channel.send('pong');
  }
}