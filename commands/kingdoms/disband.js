const { colors } = require('../../libraries')
const { MessageButton } = require('discord-buttons')

const { Command } = require('discord.js-commando')

module.exports = class create extends Command {
  constructor (client) {
    super(client, {
      name: 'disband',
      aliases: ['delete', 'del'],
      group: 'kingdoms',
      memberName: 'disband',
      description: 'Disband your kingdom and delete it FOREVER!!!'
    })
  }

  run (message, { name }) {
    const { db } = this.client
    const users = db.createModel('users')
    const kingdoms = db.createModel('kingdoms')
    // eslint-disable-next-line no-unused-vars
    const general = db.createModel('general')
    const userID = message.author.id
    users.get(`${userID}.kingdom`).then(async result1 => {
      if (result1) {
        const result = await users.get(userID)
        const role = result.role
        const kingdomInfo = await kingdoms.get(result.kingdom)
        console.log(kingdomInfo)
        if (role === 3 && kingdomInfo.owner === message.author.id) {
          message.channel.send(`:question: Are you sure you want to disband and DELETE your kingdom, ${colors.circle[kingdomInfo.color]} **${kingdomInfo.name}**? This action cannot be UNDONE!! All the Kingdom CHANNELS, STATS, ETC will be PERMANENTLY DELETED!!!! Type \`I understand that this action cannot be undone [kingdomName]\` (case sensitive) to confirm the deletion of your kingdom.`).then(() => {
            const filter = m => message.author.id === m.author.id
            message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
              .then(messages => {
                const enteredMsg = messages.first().content
                if (enteredMsg === 'I understand that this action cannot be undone ' + kingdomInfo.name) {
                  console.log('deleteKingdom' + result.kingdom)
                  // to do check if kingdom level is higher than 2 or smth
                  message.channel.send('Click the button to confirm kingdom deletion. Once you press it, your kingdom will be deleted.', new MessageButton()
                    .setLabel('Delete kingdom forever')
                    .setStyle('red')
                    .setEmoji('🗑️')
                    .setID('deleteKingdom' + result.kingdom)).then((message) => {
                    setTimeout(async function () {
                      const kingdom = await kingdoms.get(result.kingdom + '.name')
                      if (kingdom) {
                        message.edit('Button removed as you did not press it in time. Deletion cancelled.', {
                          components: []
                          // eslint-disable-next-line no-unused-vars
                        }).catch((e) => { const handled = 'a' })
                      }
                    }, 30000)
                  })
                } else {
                  return message.channel.send(':partying_face: Deletion cancelled. You did not respond with the right message.')
                }
              })
              .catch(() => {
                message.channel.send(':clock1: Timeout! You did not respond in time.')
              })
          })
        } else {
          return message.say(':police_officer: Hold up! You aren\'t the owner of this Kingdom. Only **' + this.client.users.cache.find(user => user.id === kingdomInfo.owner).tag + `** can disband this Kingdom. If you wish however, you can leave this kingdom by typing \`${this.client.commandPrefix} leave\`.`)
        }
      } else {
        return message.say(':hand_splayed: You\'re not on a Kingdom. Join or create one!')
      }
    })
  }
}
