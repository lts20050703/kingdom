module.exports = {
  group: 'test',
  name: 'reload',
  description: 'Reloads a command',
  owner_only: true,
  run (message, args) {
    if (!args.length) return message.channel.send('No arguments provided')
    const command_name = args[0].toLowerCase()
    const command = message.client.commands.get(command_name) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))

    if (!command) {
      return message.channel.send(`There is no command with name or alias \`${command_name}\`, ${message.author}!`)
    }

    delete require.cache[require.resolve(`../${command.group}/${command.name}.js`)]

    try {
      const new_command = require(`../${command.group}/${command.name}.js`)
      message.client.commands.set(new_command.name, new_command)
      message.channel.send(`Command \`${new_command.name}\` was reloaded!`)
    } catch (error) {
      console.error(error)
      message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``)
    }
  }
}
