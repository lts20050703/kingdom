require('dotenv').config()

const { readdirSync } = require('fs')
const { Client, Collection } = require('discord.js')
const bot = new Client()

bot.commands = new Collection()
bot.cooldowns = new Collection()
bot.login(process.env.token)

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
