const { prefix } = require('../../config.json')

module.exports = {
  name: 'help',
  aliases: ['commands'],
  description: 'List all of my commands or info about a specific command.',
  folder: 'test',
  cooldown: 5,
  execute (message, args) {
    const data = []
    const { commands } = message.client

    if (!args.length) {
      data.push('Here\'s a list of all my commands:')
      data.push(commands.filter(command => !command.developer_only).map(command => command.name).join(', '))
      data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`)

      return message.channel.send(data, { split: true })
    }
    const name = args[0].toLowerCase()
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

    if (!command) {
      return message.reply('that\'s not a valid command!')
    }

    data.push(`**Name:** ${command.name}`)

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
    if (command.description) data.push(`**Description:** ${command.description}`)
    // TODO settle on arguments
    // if (command.args) data.push(`**Usage:** ${prefix}${command.name} ${command.args.join(' ')}`)

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

    message.channel.send(data, { split: true })
  }
}
