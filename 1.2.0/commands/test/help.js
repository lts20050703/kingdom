const { prefixes } = require('../../config.json')

module.exports = {
  aliases: ['commands'],
  description: 'List all of my commands or info about a specific command.',
  run (bot, message, args) {
    const data = []
    const { commands } = bot

    if (!args.length) {
      data.push('Here\'s a list of all my commands:')
      data.push(commands.filter(command => !command.developer_only).map(command => command.name).join(', '))
      data.push(`\nYou can send \`${prefixes[0]}help [command name]\` to get info on a specific command!`)

      message.channel.send(data, { split: true })

      return
    }
    const name = args[0].toLowerCase()
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

    if (!command) {
      return message.reply('that\'s not a valid command!')
    }

    data.push(`**Name:** ${command.name}`)

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
    if (command.description) data.push(`**Description:** ${command.description}`)

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

    message.channel.send(data, { split: true })
  }
}
