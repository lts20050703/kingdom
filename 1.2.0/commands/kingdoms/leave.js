// const { colors } = require('../../libraries')

// const { Command } = require('discord.js-commando')

// module.exports = class leave extends Command {
//   constructor (client) {
//     super(client, {
//       name: 'leave',
//       group: 'kingdoms',
//       memberName: 'leave',
//       description: 'Leave Your Kingdom'
//     })
//   }

//   async run (message) {
//     const { db } = this.client
//     const users = db.createModel('users')
//     const kingdoms = db.createModel('kingdoms')
//     const general = db.createModel('general')
//     const userID = message.author.id
//     users.get(`${userID}`).then(async value => {
//       if (!await users.get(userID + '.kingdom')) {
//         return message.say(`You're not in any kingdom! You can create a kingdom with \`${this.client.commandPrefix} create\` or join an existing one with \`${this.client.commandPrefix} join (Kingdom name)\``)
//       }
//       if (value.role === 3) {
//         return message.say(`:rocket: You cannot leave your kingdom as you are the KING. What you can do instead is transfer the king status to a royal guard, or disband / delete this kingdom with \`${this.client.commandPrefix} disband\`.`)
//       }
//       const currentKingdom = await kingdoms.get(value.kingdom)
//       message.channel.send(`:question: Are you sure you want to leave your current kingdom, ${colors.circle[currentKingdom.color]} **${currentKingdom.name}**? Type the kingdom name to confirm. This action cannot be undone.`).then(() => {
//         const filter = m => message.author.id === m.author.id
//         message.channel.awaitMessages(filter, { time: 30000, max: 1, errors: ['time'] })
//           .then(messages => {
//             const res = messages.first().content
//             if (res === currentKingdom.name) {
//               processLeaving(message, message.author.id, value.kingdom, value.role, db, this.client)
//             } else {
//               return message.channel.send(':negative_squared_cross_mark: You did not respond with the kingdom name, action cancelled.')
//             }
//           })
//           .catch(() => {
//             message.channel.send(':clock1: Timeout! You did not respond in time.')
//           })
//       })
//     }).catch((e) => console.log(e))
//   }
// }

// async function processLeaving (message, user, kingdomId, prevrole, db, client) {
//   const users = db.createModel('users')
//   const kingdoms = db.createModel('kingdoms')
//   const general = db.createModel('general')
//   await users.delete(user)
//   const allmembers = await kingdoms.get(kingdomId + '.members')
//   const filtered = allmembers.filter(e => e !== user)
//   await kingdoms.set(kingdomId + '.members', filtered)
//   const categoryId = await kingdoms.get(kingdomId + '.category')
//   const server = client.guilds.cache.get(message.guild.id)
//   if (prevrole === 1) var role = server.roles.cache.find(r => r.name === kingdomId + ' ≼🔅Member≽')
//   if (prevrole === 2) var role = server.roles.cache.find(r => r.name === kingdomId + ' ≪💠Guard/king≫')
//   const member = await server.members.fetch(user)
//   member.roles.remove(role)
//   const channel = server.channels.cache.find(c => c.name.includes('main') && c.parentID === categoryId && c.type === 'text')
//   const count = await kingdoms.get(kingdomId + '.members')
//   channel.send(':wave: The user <@' + user + '> has left this kingdom. We are now at **' + count.length + '** member(s).')
//   message.channel.send(':white_check_mark: You successfully left this kingdom.')
//   console.log('✅ [Bot] User with ID: ' + user + ' left the kingdom with ID: ' + kingdomId)
// }
