const { readdirSync } = require('fs')

module.exports = {
  run (bot, message, args) {
    if (!args.length) return message.channel.send('No argument provided')
    const command_name = args[0].toLowerCase()

    const folders = readdirSync('./commands')
    for (const folder of folders) {
      const files = readdirSync(`./commands/${folder}`)
      for (const file of files) {
        if (file.slice(0, -3) === command_name) {
          delete require.cache[require.resolve(`../${folder}/${file}`)]
          const command = require(`../${folder}/${file}`)
          command.group = folder
          command.name = file.slice(0, -3)
          bot.commands.set(command.name, command)
          console.log(command)
          return message.channel.send(`Command ${command_name} was loaded!`)
        }
      }
    }

    message.channel.send(`There is no file with name ${command_name}.js`)
  }
}
