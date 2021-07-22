
const { prefixes, colors } = require('../../lib')

module.exports = {
  async run (bot, message, args) {
    const { users, kingdoms } = bot.db
    const { id: user_id } = message.author

    // Checking for kingdom
    if (!await users.has(`${user_id}.kingdom`)) return message.channel.send(':hand_splayed: You\'re not on a Kingdom. Join or create one!')

    // Checking for role
    if (!await users.has(`${user_id}.role`)) return message.channel.send(`:rocket: You cannot leave your kingdom as you are the KING. What you can do instead is transfer the king status to a royal guard, or disband / delete this kingdom with \`${prefixes[0]} disband\`.`)

    const kingdom = kingdoms.get(users.get(`${user_id}.kingdom`))
    message.channel.send(`:question: Are you sure you want to leave your current kingdom, ${colors.circle[kingdom.color]} **${kingdom.name}**? Type the kingdom name to confirm. This action cannot be undone.`).then(() => {
      message.channel.awaitMessages(_message => _message.author.id === message.author.id, { time: 30000, max: 1, errors: ['time'] }).then(async messages => {
        if (messages.first().content !== kingdom.name) {
          return message.channel.send(':negative_squared_cross_mark: You did not respond with the kingdom name, action cancelled.')
        }
        await users.delete(message.author.id)
        const allmembers = await kingdoms.get(kingdom.id + '.members')
        const filtered = allmembers.filter(e => e !== message.author.id)
        await kingdoms.set(kingdom.id + '.members', filtered)
        const categoryId = await kingdoms.get(kingdom.id + '.category')
        let role
        switch (await users.get(`${user_id}.role`)) {
          case 1: role = message.guild.roles.cache.find(_role => _role.name === `${kingdom.id} ≼🔅Member≽`); break
          case 2: role = message.guild.roles.cache.find(_role => _role.name === `${kingdom.id} ≪💠Guard/king≫`); break
        }
        const member = await message.guild.members.fetch(message.author.id)
        member.roles.remove(role)
        const channel = message.guild.channels.cache.find(c => c.name.includes('main') && c.parentID === categoryId && c.type === 'text')
        const count = await kingdoms.get(kingdom.id + '.members')
        channel.send(':wave: The user <@' + message.author.id + '> has left this kingdom. We are now at **' + count.length + '** member(s).')
        message.channel.send(':white_check_mark: You successfully left this kingdom.')
        console.log('✅ [Bot] User with ID: ' + message.author.id + ' left the kingdom with ID: ' + kingdom.id)
      }).catch(() => {
        message.channel.send(':clock1: Timeout! You did not respond in time.')
      })
    })
  }
}
