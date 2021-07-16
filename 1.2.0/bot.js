require('dotenv').config()

const { readdirSync } = require('fs')
const { Client, Collection } = require('discord.js')
const { prefixes, developers } = require('./config.json')
const chalk = require('chalk')
const bot = new Client()

bot.commands = new Collection()
bot.cooldowns = new Collection()

const folders = readdirSync('./commands')

for (const folder of folders) {
  const files = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`)
    bot.commands.set(command.name, command)
  }
}

bot.once('ready', () => {
  bot.user.setActivity(`with your Kingdoms | Do ${prefixes[0]} help`)
  console.log(chalk.hex('#FFFFFF').bgHex('#007F00')('✅ [Bot]'))
})

bot.on('message', message => {
  if (message.author.bot) return
  let prefix
  prefixes.forEach(_prefix => { if (message.content.startsWith(_prefix)) prefix = _prefix })
  if (!prefix) return

  const args = message.content.slice(prefix.length).trim().split(/ +/)
  const command_name = args.shift().toLowerCase()
  const command = bot.commands.get(command_name) || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command_name))

  if (!command) return

  if (command.developer_only && !developers.includes(message.author.id)) return message.channel.send('Only developers can run this command!')

  if (command.guild_only && message.channel.type === 'dm') return message.reply('I can\'t execute that command inside DMs!')

  if (command.permissions) {
    const author_perms = message.channel.permissionsFor(message.author)
    if (!author_perms || !author_perms.has(command.permissions)) return message.reply('You can not do this!')
  }

  // TODO PLEASE HANDLE ARUGUMENT IN EACH COMMAND
  // if (command.args && args.length < command.args.length) return message.channel.send(`You didn't provide ${args.length ? 'enough' : 'any'} arguments, ${message.author}!\nThe proper usage would be: \`${prefix}${command.name} ${command.args.join(' ')}\``)

  if (!bot.cooldowns.has(command.name)) bot.cooldowns.set(command.name, new Collection())

  const now = Date.now()
  const timestamps = bot.cooldowns.get(command.name)
  const cooldown_amount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expiration_time = timestamps.get(message.author.id) + cooldown_amount
    if (now < expiration_time) {
      const time_left = (expiration_time - now) / 1000
      return message.reply(`Sorry, this command is on cooldown. Please try again in ${time_left.toFixed(1)}`)
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

bot.login(process.env.token)
// checked by chriscj 15/07/21
// smart, I love the ? enough : any
