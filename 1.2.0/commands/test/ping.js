module.exports = {
  group: 'test',
  name: 'ping',
  description: 'Ping!',
  run (message, args) {
    message.channel.send('Pinging...').then(msg => msg.edit(`Pong! The message round-trip took ${(msg.editedTimestamp || msg.createdTimestamp) - (message.editedTimestamp || message.createdTimestamp)}ms. The heartbeat ping is ${Math.round(message.client.ws.ping)}ms.`))
  }
}
