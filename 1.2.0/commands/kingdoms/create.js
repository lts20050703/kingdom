const { colors, gen_id } = require('../../libraries')

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
    const kingdom_id = gen_id(10)
    const kingdom_name = args.join('-')
    general.get('kingdoms').then(kingdoms => {
      console.log('running check')
      kingdoms.forEach(async kingdom => {
        const name = await kingdoms.get(`${kingdom}.name`)
        if (kingdom_name.toLowerCase() === name.toLowerCase()) {
          return message.channel.send(':police_officer: That name is taken. Come up with an original name, please.')
        }
        if (!/^[a-zA-Z0-9-_]+$/.test(kingdom_name)) {
          return message.channel.send('Name is invalid. It must be 3-19 characters with A-Z/-_')
        }
        if (kingdom_name.length < 3) {
          return message.channel.send('Please specify a name. A good name has to be 3-19 characters long.')
        }
        if (kingdom_name.length > 20) {
          return message.channel.send('Wait. That\'s too long! Wayy too long. Please take a shorter name, 20+ characters is wayyyy too much trust me.')
        }
      })
    })
    message.channel.send(`😇 Just need a second to create your kingdom. ID: ${kingdom_id}`)
    const color = Math.floor(Math.random() * colors.id.length)
    const roles = []
    roles.push(await message.guild.create({ data: { name: `${kingdom_id} ≼🔅Member≽`, color: colors.id[color] } }))
    roles.push(await message.guild.create({ data: { name: `${kingdom_id} ≪💠Guard/king≫`, color: colors.id[color] } }))
    roles.push(await message.guild.create({ data: { name: `${kingdom_id} ⋘🔶King⋙`, color: colors.id[color] } }))
    const public_permission = [{ id: roles[1], allow: ['ATTACH_FILES', 'EMBED_LINKS'] }, { id: message.guild.roles.everyone, deny: ['MENTION_EVERYONE', 'ATTACH_FILES', 'EMBED_LINKS'] }]
    const basic_permission = [{ id: roles[1], allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: roles[0], allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]
    const restricted_permission = [{ id: roles[1], allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]
    const locked_permission = [{ id: roles[1], allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: roles[0], allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'] }]
    let category = await autoProcessesChannelAdd([['category', colors.circle[color] + kingdom_name, false, 'Creating clan ' + kingdom_name, restricted_permission]], message.guild)
    category = category[0]

    await autoProcessesChannelAdd([
      ['text', '🎯main', `${colors.book[color]} main info channel for your clan made by ${message.author.tag}`, 'Creating clan ' + kingdom_name, locked_permission, category.id],
      ['text', colors.book[color] + 'chat', `Main channel for clan ${kingdom_name}`, 'Creating clan ' + kingdom_name, basic_permission, category.id],
      ['text', colors.square[color] + 'chat seargent', `Chat channel for clan ${kingdom_name}`, 'Creating clan ' + kingdom_name, restricted_permission, category.id],
      ['text', colors.heart[color] + 'border', `Border channel for clan ${kingdom_name}`, 'Creating clan ' + kingdom_name, public_permission, category.id]
    ], message.guild)
    await message.member.roles.add(roles[2])
    await users.set(USER_ID + '.kingdom', kingdom_id)
    await users.set(USER_ID + '.role', 3)
    await general.push('kingdoms', kingdom_id)
    await kingdoms.set(kingdom_id + '.name', kingdom_name)
    await kingdoms.set(kingdom_id + '.color', color)
    await kingdoms.push(kingdom_id + '.members', USER_ID)
    await kingdoms.set(kingdom_id + '.owner', USER_ID)
    await kingdoms.set(kingdom_id + '.category', category.id)
    await kingdoms.set(kingdom_id + '.creationDate', (Date.now()))
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
