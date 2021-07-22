// const { Command } = require('discord.js-commando')

module.exports = class invite extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      group: 'kingdoms',
      memberName: 'invite',
      description: 'Invite someone to your group'
    })
  }

  run (message) {
    message.say('You can use the dashboard to invite someone to your kingdom! https://kingdoms.reals.tech/dashboard')
  }
}
