// WEBSITE

require('./dashboard/backend/index')

// DATABASE

const { db, general, sessions, users, kingdoms } = require('./db.js')

// BOT

const { bot } = require('./client.js')
const client = bot

// Discord Buttons
const buttons = require('discord-buttons')
buttons(client)

// Deleting kingdom
async function deleteKingdom (channel, guild, user, kingdom) {
  // Delete all members and send them info dm
  const allMembers = await kingdoms.get(kingdom + '.members')
  for (const member of allMembers) {
    const userInfo = await users.get(member)
    if (userInfo.role < 3) {
      console.log('sending dm to user: ' + member)
      client.users.cache.get(member).send('Hello! This is a message to let you know that <@' + user + '> disbanded the kingdom you previously were on. You are no longer in a kingdom. (Your personal stats are unchanged.)').catch((e) => { console.log(e) })
    }
    await users.delete(member)
  }
  // Delete all roles
  const server = client.guilds.cache.get(guild)
  const memberRole = server.roles.cache.find(r => r.name == kingdom + ' ≼🔅Member≽')
  const staffRole = server.roles.cache.find(r => r.name == kingdom + ' ≪💠Guard/king≫')
  memberRole.delete().catch((e) => { console.log(e) })
  staffRole.delete().catch((e) => { console.log(e) })
  // Delete all channels and category
  const category = await kingdoms.get(kingdom + '.category')
  const channels = server.channels.cache.filter(c => c.parentID == category && c.type == 'text')
  for (const channel of channels) {
    server.channels.cache.get(channel[0]).delete().catch((e) => { console.log(e) })
  }
  server.channels.cache.find(c => c.id === category).delete().catch((e) => { console.log(e) })
  // Delete the kingdom database
  await kingdoms.delete(kingdom)
  const allKingdoms = await general.get('kingdoms')
  const filtered = allKingdoms.filter(e => e !== kingdom)
  await general.set('kingdoms', filtered)
  // Finishing up
  console.log(`✅ [Bot] Kingdom ${kingdom} was deleted.`)
  channel.send('<@' + user + '> your kingdom was successfully disbanded.').catch((e) => {
    client.users.cache.get(user).send('<@' + user + '> your kingdom was successfully disbanded.').catch((e) => { console.log(e) })
  })
}

// Handle button presses
client.on('clickButton', async button => {
  if (button.id.startsWith('deleteKingdom')) {
    await button.clicker.fetch()
    const kingdom = button.id.replace('deleteKingdom', '')
    const user = button.clicker.user.id
    console.log(kingdom)
    const userInfo = await users.get(user)
    const kingdomInfo = await kingdoms.get(kingdom)
    if (userInfo && kingdomInfo) {
      if (userInfo.role === 3 && kingdomInfo.owner === user) {
        await button.think()
        setTimeout(async function () {
          await button.reply.delete()
          await button.message.edit('Starting kingdom deletion', { components: [] })
          deleteKingdom(button.channel, button.guild.id, user, kingdom)
        }, 3000)
      } else {
        await button.reply.send("You don't have permission to delete this kingdom.", true)
      }
    } else {
      // await button.message.edit('Error with button', { components: [] })
      await button.reply.send('You don\'t have permission to delete this kingdom.', true)
    }
  }
})

module.exports = { bot: client }
