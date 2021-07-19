const { prefixes } = require('../config.json')

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

    command.run(bot, message, args)
  }
}
