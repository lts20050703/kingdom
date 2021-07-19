module.exports = {
  description: 'Reloads a command',
  owner_only: true,
  run (message, args, bot) {
    this.success = false

    if (!args.length) return message.channel.send('No argument provided')
    if (args[0] === 'event') return message.channel.send('~~`kd reload event`~~ `kd reloadevent`')
    const command_name = args[0].toLowerCase()
    const command = bot.commands.get(command_name) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))

    if (!command) return message.channel.send(`There is no command with name or alias \`${command_name}\`, ${message.author}!`)

    delete require.cache[require.resolve(`../${command.group}/${command.name}.js`)]

    const new_command = require(`../${command.group}/${command.name}.js`)

    new_command.group = command.group
    new_command.name = command.name

    bot.commands.set(new_command.name, new_command)

    message.channel.send(`Command \`${new_command.name}\` was reloaded!`)

    this.success = true
  }
}
