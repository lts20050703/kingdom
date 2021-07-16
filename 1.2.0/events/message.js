const { prefixes, owners } = require('../config.json')

module.exports = {
  name: 'message',
  once: false,
  execute (message, bot) {
    if (message.author.bot) return
    let prefix
    prefixes.forEach(_prefix => { if (message.content.startsWith(_prefix)) prefix = _prefix })
    if (!prefix) return

    const args = message.content.slice(prefix.length).trim().split(/ +/)
    const command_name = args.shift().toLowerCase()
    const command = bot.commands.get(command_name) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))

    if (!command) return

    if (!command.run) return message.channel.send('Someone forgot to add `run (message, args): {}`')

    if (command.owner_only && !owners.includes(message.author.id)) return message.channel.send(`The \`${command.name}\` command can only be used by the bot owner.`)

    if (command.guild_only && message.channel.type === 'dm') return message.reply('I can\'t execute that command inside DMs!')

    if (command.permissions) {
      const author_perms = message.channel.permissionsFor(message.author)
      if (!author_perms || !author_perms.has(command.permissions)) return message.reply('You can not do this!')
    }

    // TODO PLEASE HANDLE ARUGUMENT IN EACH COMMAND
    // if (command.args && args.length < command.args.length) return message.channel.send(`You didn't provide ${args.length ? 'enough' : 'any'} arguments, ${message.author}!\nThe proper usage would be: \`${prefix}${command.name} ${command.args.join(' ')}\``)

    const now = Date.now()
    const cooldown_amount = (command.cooldown || 3) * 1000

    if (bot.db.cooldowns.has(`${command.name}.${message.author.id}`)) {
      const expiration_time = bot.db.cooldowns.get(`${command.name}.${message.author.id}`) + cooldown_amount
      if (now < expiration_time) {
        const time_left = (expiration_time - now) / 1000
        return message.reply(`Sorry, this command is on cooldown. Please try again in ${time_left.toFixed(1)}`)
      }
    }

    bot.db.cooldowns.set(`${command.name}.${message.author.id}`, now)

    setTimeout(() => bot.db.cooldowns.delete(`${command.name}.${message.author.id}`), cooldown_amount)

    try {
      command.run(message, args)
    } catch (error) {
      console.error(error)
      message.reply('there was an error trying to execute that command!')
    }
  }
}
