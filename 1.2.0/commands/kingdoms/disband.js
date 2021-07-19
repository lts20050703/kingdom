const { prefix } = require('../../config.json')
const { colors } = require('../../libraries')
const { MessageButton } = require('discord-buttons')

module.exports = {
  aliases: ['delete', 'del'],
  description: 'Disband your kingdom and delete it forever',
  run (bot, message, args) {
    const { client: { db: { users, kingdoms } }, author: { id: user_id } } = message
    users.get(`${user_id}.kingdom`).then(async kingdom => {
      if (!kingdom) return message.channel.send(':hand_splayed: You\'re not on a Kingdom. Join or create one!')
      const role = await users.get(`${user_id}.role`)
      const owner = await kingdoms.get(`${await users.get(`${user_id}.kingdom`)}.owner`)
      const kingdom_id = await users.get(`${user_id}.kingdom`)
      const kingdom_color = await kingdoms.get(`${kingdom_id}.color`)
      const kingdom_name = await kingdoms.get(`${kingdom_id}.name`)
      if (role !== 3 || owner !== message.author.id) {
        return message.say(':police_officer: Hold up! You aren\'t the owner of this Kingdom. Only **' + this.client.users.cache.find(user => user.id === owner).tag + `** can disband this Kingdom. If you wish however, you can leave this kingdom by typing \`${prefix} leave\`.`)
      }
      message.channel.send(`:question: Are you sure you want to disband and DELETE your kingdom, ${colors.circle[kingdom_color]} **${kingdom_name}**? This action cannot be UNDONE!! All the Kingdom CHANNELS, STATS, ETC will be PERMANENTLY DELETED!!!! Type \`I understand that this action cannot be undone [kingdom name]\` (case sensitive) to confirm the deletion of your kingdom.`).then(() => {
        const filter = m => message.author.id === m.author.id
        message.channel.awaitMessages(filter, { time: 60000, max: 1, errors: ['time'] })
          .then(messages => {
            const enteredMsg = messages.first().content
            if (enteredMsg === 'I understand that this action cannot be undone ' + kingdom_name) {
              console.log(`Delete Kingdom ${kingdom_name} (ID ${kingdom_id})`)
              // to do check if kingdom level is higher than 2 or smth
              message.channel.send('Click the button to confirm kingdom deletion. Once you press it, your kingdom will be deleted.', new MessageButton()
                .setLabel('Delete kingdom forever')
                .setStyle('red')
                .setEmoji('🗑️')
                .setID('delete_kingdom' + kingdom_id)).then((message) => {
                setTimeout(async function () {
                  const kingdom = await kingdoms.get(`${kingdom_id}.name`)
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
    })
  }
}
