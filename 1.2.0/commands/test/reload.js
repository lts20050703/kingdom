module.exports = {
  name: 'reload',
  description: 'Reloads a command',
  args: 1,
  usage: '<command name>',
  folder: 'test',
  execute (message, args) {
    const command_name = args[0].toLowerCase()
    const command = message.client.commands.get(command_name) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))

    if (!command) {
      return message.channel.send(`There is no command with name or alias \`${command_name}\`, ${message.author}!`)
    }

    // Update to v1.1.3.2 (Beta)
    if (!command.folder) {
      return message.channel.send('Please update to v1.1.3.2 (Beta)\nProperty `folder: ` missing')
    }

    delete require.cache[require.resolve(`../${command.folder}/${command.name}.js`)]

    try {
      const new_command = require(`../${command.folder}/${command.name}.js`)
      message.client.commands.set(new_command.name, new_command)
      message.channel.send(`Command \`${new_command.name}\` was reloaded!`)
    } catch (error) {
      console.error(error)
      message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``)
    }
  }
}
