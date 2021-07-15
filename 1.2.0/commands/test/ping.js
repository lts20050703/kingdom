module.exports = {
  name: 'ping',
  description: 'Ping!',
  folder: 'test',
  execute (message, args) {
    message.channel.send('Pong.')
  }
}
