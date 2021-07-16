module.exports = {
  name: 'ping',
  description: 'Ping!',
  folder: 'test',
  execute (message, args) {
    message.channel.send('Pinging...').then(msg => msg.edit(`Pong! The message round-trip took ${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms. The heartbeat ping is ${Math.round(message.client.ws.ping)}ms.`))
  }
}
