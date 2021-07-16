const { COLORS, GEN_ID } = require('../../index')

module.exports = {
  group: 'kingdoms',
  name: 'create',
  description: 'Create your epic kingdom!',
  guild_only: true,
  async run (message, args) {
    message.channel.send('Under migration')
    const { client: { db: { users, kingdoms, general } }, author: { id: USER_ID } } = message
    users.get(`${USER_ID}.kingdom`).then(kingdom => {
      if (kingdom) return message.say(':angry: Not so fast! You\'re currently on a Kingdom. If you want to create your own kingdom, leave that first.')
    })
    const KINGDOM_ID = GEN_ID(10)
    const KINGDOM_NAME = args.join('-')
    general.get('kingdoms').then(kingdoms => {
      console.log('running check')
      kingdoms.forEach(async kingdom => {
        const NAME = await kingdoms.get(`${kingdom}.name`)
        if (KINGDOM_NAME.toLowerCase() === NAME.toLowerCase()) {
          return message.channel.send(':police_officer: That name is taken. Come up with an original name, please.')
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(KINGDOM_NAME)) {
          return message.channel.send('Name is invalid. It must be 3-19 characters with A-Z/-_')
        }
        if (KINGDOM_NAME.length < 3) {
          return message.channel.send('Please specify a name. A good name has to be 3-19 characters long.')
        }
        if (KINGDOM_NAME.length > 20) {
          return message.channel.send('Wait. That\'s too long! Wayy too long. Please take a shorter name, 20+ characters is wayyyy too much trust me.')
        }
      })
    })
    message.channel.send(`😇 Just need a second to create your kingdom. ID: ${KINGDOM_ID}`)
    const COLOR = Math.floor(Math.random() * COLORS.ID.length)
    const ROLES = []
    ROLES.push(await message.guild.create({ data: { name: `${KINGDOM_ID} ≼🔅Member≽`, color: COLORS.ID[COLOR] } }))
    ROLES.push(await message.guild.create({ data: { name: `${KINGDOM_ID} ≪💠Guard/king≫`, color: COLORS.ID[COLOR] } }))
    ROLES.push(await message.guild.create({ data: { name: `${KINGDOM_ID} ⋘🔶King⋙`, color: COLORS.ID[COLOR] } }))
    const PUBLIC = [{ id: ROLES[1], allow: ['ATTACH_FILES', 'EMBED_LINKS'] }, { id: message.guild.roles.everyone, deny: ['MENTION_EVERYONE', 'ATTACH_FILES', 'EMBED_LINKS'] }]
    const BASIC = [{ id: ROLES[1], allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: ROLES[0], allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]
    const RESTRICTED = [{ id: ROLES[1], allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]
    const LOCKED = [{ id: ROLES[1], allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: ROLES[0], allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'] }]
    let category = await autoProcessesChannelAdd([['category', COLORS.CIRCLE[COLOR] + KINGDOM_NAME, false, 'Creating clan ' + KINGDOM_NAME, RESTRICTED]], message.guild)
    category = category[0]

    await autoProcessesChannelAdd([
      ['text', '🎯main', `${COLORS.BOOK[COLOR]} main info channel for your clan made by ${message.author.tag}`, 'Creating clan ' + KINGDOM_NAME, LOCKED, category.id],
      ['text', COLORS.BOOK[COLOR] + 'chat', `Main channel for clan ${KINGDOM_NAME}`, 'Creating clan ' + KINGDOM_NAME, BASIC, category.id],
      ['text', COLORS.SQUARE[COLOR] + 'chat seargent', `Chat channel for clan ${KINGDOM_NAME}`, 'Creating clan ' + KINGDOM_NAME, RESTRICTED, category.id],
      ['text', COLORS.HEART[COLOR] + 'border', `Border channel for clan ${KINGDOM_NAME}`, 'Creating clan ' + KINGDOM_NAME, PUBLIC, category.id]
    ], message.guild)
    await message.member.roles.add(ROLES[2])
    await users.set(USER_ID + '.kingdom', KINGDOM_ID)
    await users.set(USER_ID + '.role', 3)
    await general.push('kingdoms', KINGDOM_ID)
    await kingdoms.set(KINGDOM_ID + '.name', KINGDOM_NAME)
    await kingdoms.set(KINGDOM_ID + '.color', COLOR)
    await kingdoms.push(KINGDOM_ID + '.members', USER_ID)
    await kingdoms.set(KINGDOM_ID + '.owner', USER_ID)
    await kingdoms.set(KINGDOM_ID + '.category', category.id)
    await kingdoms.set(KINGDOM_ID + '.creationDate', (Date.now()))
  }
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
