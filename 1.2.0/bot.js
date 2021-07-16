const { readdirSync } = require('fs')
const { Client, Collection } = require('discord.js')
const { Database } = require('quickmongo')
const chalk = require('chalk')
const bot = new Client()

bot.commands = new Collection()

bot.db = new Database(process.env.db)

bot.db.on('ready', () => console.log(chalk.hex('#FFFFFF').bgHex('#007F00')('✅ [Database] Connected to MongoDB!')))
bot.db.on('error', error => console.error(chalk.hex('#FFFFFF').bgHex('#7F0000')(`❌ [Database] Error: ${error}`)))

bot.db.users = bot.db.createModel('users')
bot.db.kingdoms = bot.db.createModel('kingdoms')
bot.db.general = bot.db.createModel('general')
bot.db.sessions = bot.db.createModel('sessions')
bot.db.cooldowns = bot.db.createModel('cooldowns')

// Events Handler
const files = readdirSync('./events').filter(file => file.endsWith('.js'))
for (const file of files) {
  const event = require(`./events/${file}`)
  if (event.once) bot.once(event.name, (...args) => event.execute(...args, bot))
  else bot.on(event.name, (...args) => event.execute(...args, bot))
}

// Commands Handler
const folders = readdirSync('./commands')
for (const folder of folders) {
  const files = readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'))
  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`)
    bot.commands.set(command.name, command)
  }
}

bot.login(process.env.token)
