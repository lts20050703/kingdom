// BOT
require('dotenv').config()
const { db, general, sessions, users, kingdoms } = require('./db')

const { commandPrefix, owner, groups } = require('./config.json')

const { CommandoClient } = require('discord.js-commando')

const client = new CommandoClient({ commandPrefix, owner })

client.login(process.env.token)

client.on('error', error => console.error(`❌ [Bot] Error: ${error}`))
client.on('ready', async () => {
  client.db = db // Make the database accessible everywhere
  client.user.setActivity(`with your Kingdoms | Do ${commandPrefix} help`)
  console.log(`✅ [Bot] Logged in as ${client.user.tag}!`)
})

// Dont put this below client.registry

client.registry
  .registerDefaultTypes()
  .registerGroups(groups)
  .registerDefaultGroups()
  .registerDefaultCommands({
    prefix: false,
    ping: false,
    unknownCommand: false
  })
  .registerCommandsIn(require('path').join(__dirname, '/commands'))

  module.exports = { bot: client }

