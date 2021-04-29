module.exports = {
  name: 'ping',
  description: 'test connection',
  execute(message, args) {
    message.channel.send('pong');
  }
}