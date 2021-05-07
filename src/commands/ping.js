const testing = () => {
  console.log("command ping is here");
}

module.exports = {
  name: 'ping',
  description: 'test connection',
  execute(client, message, args) {
    testing();
    message.channel.send('pong');
  }
}