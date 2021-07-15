require('dotenv').config()

const { readdirSync } = require('fs')
const { Client, Collection } = require('discord.js')
const { prefix, developers } = require('./config.json')
const chalk = require('chalk')
const client = new Client()

client.commands = new Collection()
client.cooldowns = new Collection()

const folders = readdirSync('./commands')

for (const folder of folders) {
  const files = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`)
    client.commands.set(command.name, command)
  }
}

client.once('ready', () => {
  client.user.setActivity(`with your Kingdoms | Do ${prefix} help`)
  console.log(chalk.hex('#FFFFFF').bgHex('#007F00')('✅ [Bot]'))
})

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const command_name = args.shift().toLowerCase()
  const command = client.commands.get(command_name) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))

  if (!command) return

  if (command.developer_only && !developers.includes(message.author.id)) return message.channel.send('Only developers can run this command!')

  if (command.guild_only && message.channel.type === 'dm') return message.reply('I can\'t execute that command inside DMs!')

  if (command.permissions) {
    const author_perms = message.channel.permissionsFor(message.author)
    if (!author_perms || !author_perms.has(command.permissions)) return message.reply('You can not do this!')
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (command.usage) reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    return message.channel.send(reply)
  }

  if (command.args && args.length < command.args) {
    let reply = `You didn't provide enough arguments, ${message.author}!`
    if (command.usage) reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    return message.channel.send(reply)
  }

  if (!client.cooldowns.has(command.name)) client.cooldowns.set(command.name, new Collection())

  const now = Date.now()
  const timestamps = client.cooldowns.get(command.name)
  const cooldown_amount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expiration_time = timestamps.get(message.author.id) + cooldown_amount
    if (now < expiration_time) {
      const time_left = (expiration_time - now) / 1000
      return message.reply(`please wait ${time_left.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
    }
  }

  timestamps.set(message.author.id, now)

  setTimeout(() => timestamps.delete(message.author.id), cooldown_amount)

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('there was an error trying to execute that command!')
  }
})

client.login(process.env.token)
