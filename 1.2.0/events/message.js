const ms = require('ms')
const { Collection } = require('discord.js')
const { prefixes, owners } = require('../config.json')

module.exports = {
  async run (bot, message) {
    // Preventing Botception
    if (message.author.bot) return

    // Checking Prefix
    let prefix
    for (const _prefix of prefixes) if (message.content.startsWith(_prefix)) prefix = _prefix
    if (!prefix) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command_name = args.shift().toLowerCase()
    const command = bot.commands.get(command_name) || bot.commands.find(_command => _command.aliases && _command.aliases.includes(command_name))

    if (!command) return

    // checking owners only
    if (command.owner_only && !owners.includes(message.author.id)) return message.channel.send(`The ${command.name} command can only be used by the bot owners`)

    // checking guild only
    if (command.guild_only && !message.guild) return message.channel.send(`The ${command.name} command must be used in a server channel.`)

    // checking args
    if (args.length < command.args) return message.channel.send(`You didn't provide ${args.length ? 'enough' : 'any'} arguments`)

    // checking cooldown
    if (!bot.cooldowns.has(command.name)) bot.cooldowns.set(command.name, new Collection())

    const now = Date.now()
    const timestamps = bot.cooldowns.get(command.name)
    let cooldown_amount
    switch (typeof command.cooldown) {
      case 'string': cooldown_amount = ms(command.cooldown); break
      case 'number': cooldown_amount = command.cooldown; break
      default: cooldown_amount = ms('3s')
    }

    if (timestamps.has(message.author.id) || bot.db.cooldowns.has(`${command.name}.${message.author.id}`)) {
      const expiration_time = (timestamps.get(message.author.id) || bot.db.cooldowns.get(`${command.name}.${message.author.id}`)) + cooldown_amount

      const time_left = expiration_time - now
      if (time_left > ms('1s')) {
        message.channel.send(`Please wait ${ms(time_left, { long: true })} more second(s) before reusing the ${command.name} command.`)
        return true
      }
    }

    timestamps.set(message.author.id, now)
    bot.db.set(`${command.name}.${message.author.id}`, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldown_amount)
    setTimeout(() => bot.db.cooldowns.delete(`${command.name}.${message.author.id}`), cooldown_amount)

    command.run(bot, message, args)
  }
}
