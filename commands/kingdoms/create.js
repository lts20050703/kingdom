const { colors } = require('../../libraries')

function genID (length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let ID = ''
  for (let i = 0; i < length; i++) {
    ID += characters[Math.floor(Math.random() * characters.length)]
  }

  return ID
}

const { Command } = require('discord.js-commando')

module.exports = class create extends Command {
  constructor (client) {
    super(client, {
      name: 'create',
      group: 'kingdoms',
      memberName: 'create',
      description: 'Create your epic kingdom!',
      args: [{
        key: 'name',
        prompt: 'Kingdom name?',
        type: 'string'
      }]
    })
  }

  async run (message, { name }) {
    const { createKingdom } = require('../../universialCreate.js')
    const { db } = this.client
    const users = db.createModel('users')
    // eslint-disable-next-line no-unused-vars
    const kingdoms = db.createModel('kingdoms')
    // eslint-disable-next-line no-unused-vars
    const general = db.createModel('general')
    const userID = message.author.id
    await createKingdom(this.client, userID, name, 1, message)
    /*
    users.get(`${userID}.kingdom`).then(result => {
      if (result) {
        return message.say(':angry: Not so fast! You\'re currently on a Kingdom. If you want to create your own kingdom, leave that first.')
      }

      // Chris code goes here
      const newKingdomID = genID(10)
      chriscreateCommand(message, name.split(' '), this.client, newKingdomID, db)
      // Message.say("chris will now create ur super cool kingdom with the ID "+newKingdomId)
    })
    */
  }
}
// eslint-disable-next-line max-params
async function chriscreateCommand (message, args, bot, newKingdomId, db) {
  const mb = message.member
  const ch = message.channel
  if (message.guild.id !== '528602970569441282') {
    return send(ch, 'Sorry, this command is not available where you are. Easy done: join this: https://discord.gg/EnYNswe')
  }

  const g = bot.guilds.cache.get('528602970569441282') || message.guild
  if (!g.available) {
    return send(ch, 'Sorry guild is not available.')
  }
  // TODO: Check if the player already has a kingdom

  // Define user ID - Real
  // eslint-disable-next-line no-unused-vars
  const userID = message.author.id

  // Checking the db... - Real
  // eslint-disable-next-line no-unused-vars
  const users = db.createModel('users')
  const kingdoms = db.createModel('kingdoms')
  const general = db.createModel('general')
  // TODO: Check if the player has created fewer than 2 lifetime kingdoms (people won't be allowed to create more than 2 kingdoms even if he left the previous ones)
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
      return send(ch, ':police_officer: That name is taken. Come up with an original name, please.')
    }

    if (!/^[a-zA-Z0-9-_]+$/.test(kgdName)) {
      return ch.send('Name is invalid. It must be 3-19 characters with A-Z/-_')
    }

    if (kgdName.includes(':')) {
      ch.send('Error: Banned character  ``:``')
    }

    if (kgdName.length < 3) {
      return ch.send('Please specify a name. A good name has to be 3-19 characters long.')
    }

    if (kgdName.length > 20) {
      return ch.send('Wait. That\'s too long! Wayy too long. Please take a shorter name, 20+ characters is wayyyy too much trust me.')
    }

    // Name.replace(/\W/g, '').toLowerCase();
    ch.send(`😇 Just need a second to create your kingdom. ID: ${newKingdomId}`)
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
    dbNewKingdom(db, userID, newKingdomId, kgdName, color, category).then(() => ch.send(`☑ I've created your kingdom:  ${colors.square[color]} **${kgdName}**`)).catch(e => send(ch, 'Oof. There was an error trying to save to the database `' + e + '`'))
  }).catch(e => send(ch, 'Oof. There was an error `' + e + '`'))
}

// eslint-disable-next-line max-params
async function dbNewKingdom (db, userID, newKingdomId, kgdName, color, category) {
  const users = db.createModel('users')
  const kingdoms = db.createModel('kingdoms')
  const general = db.createModel('general')
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
