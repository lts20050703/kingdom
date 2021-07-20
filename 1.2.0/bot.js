const { readdirSync } = require('fs')
const { log } = require('./lib')

// Discord Bot
const { Client, Collection } = require('discord.js')
const bot = new Client()
bot.login(process.env.token)

// Discord Bot Events Handler
const files = readdirSync('./events')
for (const file of files) {
  const event = require(`./events/${file}`)
  if (!event.name) event.name = file.replace('.js', '')
  if (event.run) bot.on(event.name, (...args) => event.run(bot, ...args))
  else log(1, `[${file}] run () {} missing! The ${file.slice(0, -3)} event will NOT be handled!`)
}

// Discord Bot Commands Handler
bot.commands = new Collection()
const folders = readdirSync('./commands')
for (const folder of folders) {
  const files = readdirSync(`./commands/${folder}`)
  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`)
    if (!command.group) command.group = folder
    if (!command.name) command.name = file.replace('.js', '')
    if (command.run) bot.commands.set(command.name, command)
    else log(1, `[${file}] run () {} missing! The ${file.slice(0, -3)} command will NOT be handled`)
  }
}

// Discord Buttons
const buttons = require('discord-buttons')
buttons(bot)

// Database
const { Database } = require('quickmongo')
bot.db = new Database(process.env.db)

// Database Events Handler
bot.db.on('ready', () => log(2, `✅ [Database] Connected to ${/372005/.test(process.env.db) ? '372005' : 'Kingdoms'} Database!`))

// Database Models
bot.db.users = bot.db.createModel('users')
bot.db.general = bot.db.createModel('general')
bot.db.kingdoms = bot.db.createModel('kingdoms')
bot.db.sessions = bot.db.createModel('sessions')
bot.db.cooldowns = bot.db.createModel('cooldowns')
bot.db.cooldowns2 = bot.db.createModel('cooldowns2')

// Cooldowns
bot.cooldowns = new Collection()
bot.cooldowns2 = new Collection()
