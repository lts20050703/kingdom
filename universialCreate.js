// DATABASE

const { db, general, sessions, users, kingdoms } = require('./db.js')

// BOT

const bot = require('./client.js')
const client = bot

//console.log('The client2'+JSON.stringify(bot))

// Creating kingdoms

// Stuff required for this to work

async function dbNewKingdom ( userID, newKingdomId, kgdName, color, category) {
  await users.set(userID + '.kingdom', newKingdomId)
  await users.set(userID + '.role', 3)
  await general.push('kingdoms', newKingdomId)
  await kingdoms.set(newKingdomId + '.name', kgdName)
  await kingdoms.set(newKingdomId + '.color', color)
  await kingdoms.push(newKingdomId + '.members', userID)
  await kingdoms.set(newKingdomId + '.owner', userID)
  await kingdoms.set(newKingdomId + '.category', category.id)
  await kingdoms.set(newKingdomId + '.creationDate', (Date.now() - kingdomEpoch))
}

function send (ch, msg) {
  ch.send(msg)
}
const kingdomEpoch = 1624385650000

const { colors } = require('./libraries.js')

function genID (length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let ID = ''
  for (let i = 0; i < length; i++) {
    ID += characters[Math.floor(Math.random() * characters.length)]
  }

  return ID
}

async function autoProcessesChannelAdd (channels, g) {
  // [ ['type','name','topic','reason',[{permissions:allow}]],parent ]
  // It would take 75 lines to create 5 channels now it takes only 5 lines.
  const newChans = []
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i]
    newChans.push(g.channels.create(channel[1], {
      type: channel[0],
      permissionOverwrites: channel[4],
      topic: channel[2],
      reason: channel[3],
      parent: channel[5]
    }))
  }

  return Promise.all(newChans)
}

async function createKingdom(user, name, from, message) {
  var userID = user
  name = name.split(' ')
  // if from = 1 -> requested from bot
  // if from = 2 -> requested from website
  users.get(`${userID}.kingdom`).then(result => {
    if (result) {
      if(from==1) return message.channel.send(':angry: Not so fast! You\'re currently on a Kingdom. If you want to create your own kingdom, leave that first.')
      if(from==2) return {status: 'error', message: 'You are already on a Kingdom!'}
    }
    const newKingdomID = genID(10)
    //chriscreateCommand(message, name.split(' '), this.client, newKingdomID, db)
    // Message.say("chris will now create ur super cool kingdom with the ID "+newKingdomId)
    if(from==1) {
    const mb = message.member
    const ch = message.channel
    } else {
      var guild = client.guilds.cache.get('528602970569441282') // get the guild object
      const mb = guild.member(user)
    }
    const g = client.guilds.cache.get('528602970569441282')
    if (!g.available) {
      if(from==1) return send(ch, 'Sorry guild is not available.')
      if(from==2) return {status: 'error', message: 'Sorry guild is not available. This is a Discord API error and should be fixed soon.'}
    }
    // TODO: Check if the player already has a kingdom

    // Define user ID - Real
    // eslint-disable-next-line no-unused-vars
    const userID = user

    // Checking the db... - Real
    // eslint-disable-next-line no-unused-vars
    
    // TODO: Check if the player has created fewer than 2 lifetime kingdoms (people won't be allowed to create more than 2 kingdoms even if he left the previous ones)
    var args = name
    const kgdName = args.join('-')
    // TODO: Check if this name is already taken
    general.get('kingdoms').then(async allkingdoms => {
      let allowed = true
      if (allkingdoms) {
        console.log('running check')
        allkingdoms.forEach(async kd => {
          const thisName = await kingdoms.get(kd + '.name')
          console.log('name chosen: ' + kgdName + ' other kingdom name: ' + thisName)
          if (thisName.toLowerCase() === kgdName.toLowerCase()) {
            allowed = false
            console.log('set to false!')
          }
        })
      }

      if (!allowed) {
        if(from==1) return message.channel.send(ch, ':police_officer: That name is taken. Come up with an original name, please.')
        if(from==2) return {status:'error', message: 'That name is taken. Come up with an original name, please.'}
      }

      if (!/^[a-zA-Z0-9-_]+$/.test(kgdName)) {
        if(from==1) return message.channel.send('Name is invalid. It must be 3-19 characters with A-Z/-_')
        if(from==2) return {status:'error', message: 'Name is invalid. It must be 3-19 characters with A-Z/-_'}
      }

      if (kgdName.includes(':')) {
        if(from==1) return ch.send('Error: Banned character  ``:``')
        if(from==2) return {status:'error', message: 'Error: Banned character'}
      }

      if (kgdName.length < 3) {
        if(from==1) return ch.send('Please specify a name. A good name has to be 3-19 characters long.')
        if(from==2) return {status:'error', message: 'A good name has to be 3-19 characters long. Try again.'}
      }

      if (kgdName.length > 20) {
        if(from==1) return ch.send('Wait. That\'s too long! Wayy too long. Please take a shorter name, 20+ characters is wayyyy too much trust me.')
        if(from==2) return {status:'error', message: 'Wait. That\'s too long! Wayy too long. Please take a shorter name, 20+ characters is wayyyy too much.'}
      }

      // Name.replace(/\W/g, '').toLowerCase();
      if(from==1) ch.send(`😇 Just need a second to create your kingdom. ID: ${newKingdomId}`)

      const color = Math.floor(Math.random() * colors.id.length)
      const rid = newKingdomId
      const r1 = await g.roles.create({ data: { name: rid + ' ≼🔅Member≽', color: colors.id[color], hoist: true } })
      const r2 = await g.roles.create({ data: { name: rid + ' ≪💠Guard/king≫', color: colors.id[color] } })
      // Let r3 = await g.roles.create({ data: { name: rid+' ⋘🔶King⋙',color:color_roles[color]}});
      // g.createChannel(kgdName, "text")
      const publicPermissions = [{ id: r2, allow: ['ATTACH_FILES', 'EMBED_LINKS'] }, { id: g.roles.everyone, deny: ['MENTION_EVERYONE', 'ATTACH_FILES', 'EMBED_LINKS'] }]
      const basicPermissions = [{ id: r2, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: r1, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }, { id: g.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]
      const restrictedPermissions = [{ id: r2, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: g.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]
      const lockedPermissions = [{ id: r2, allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: r1, allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: g.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'] }]
      // 'MUTE_MEMBERS','DEAFEN_MEMBERS','CONNECT'
      let category = await autoProcessesChannelAdd([['category', colors.circle[color] + kgdName, false, 'Creating clan ' + kgdName, restrictedPermissions]], g)

      category = category[0]
      // eslint-disable-next-line no-unused-vars
      const channels = await autoProcessesChannelAdd([
        ['text', '🎯main', `${colors.book[color]} main info channel for your clan made by ${message.author.tag}`, 'Creating clan ' + kgdName, lockedPermissions, category.id],
        ['text', colors.book[color] + 'chat', `Main channel for clan ${kgdName}`, 'Creating clan ' + kgdName, basicPermissions, category.id],
        ['text', colors.square[color] + 'chat seargent', `Chat channel for clan ${kgdName}`, 'Creating clan ' + kgdName, restrictedPermissions, category.id],
        ['text', colors.heart[color] + 'border', `Border channel for clan ${kgdName}`, 'Creating clan ' + kgdName, publicPermissions, category.id]
      ], g)
      await mb.roles.add(r2)

      const userID = message.author.id
      dbNewKingdom(userID, newKingdomId, kgdName, color, category).then(() => {
        if(from==1) return ch.send(`☑ I've created your kingdom:  ${colors.square[color]} **${kgdName}**`)
        if(from==2) return {status:'success', message: `Your new kingdom was successfully created! Epic! ${colors.square[color]} **${kgdName}**`}
      }).catch(e => {
        if(from==1) return send(ch, 'Oof. There was an error trying to save to the database `' + e + '`')
        if(from==2) return {status: 'error', message: 'There was an error trying to save to the database.'}
      })
    }).catch(e => {
      if(from==1) return send(ch, 'Oof. There was an error `' + e + '`')
        if(from==2) return {status: 'error', message: 'There was an error.'}
    })
  })
}

module.exports = {
  createKingdom: createKingdom
}