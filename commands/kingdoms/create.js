const { colors } = require('../../lib')

module.exports = {
	args: 1,
	async run (bot, message, args) {
		const { db: { users, kingdoms, general } } = bot
		const { author: { id: user_id } } = message
		let reply

		// Check in kingdom
		await users.get(`${user_id}.kingdom`).then(kingdom => {
			if (kingdom) reply = ':angry: Not so fast! You\'re currently on a Kingdom. If you want to create your own kingdom, leave that first.'
		})
		if (reply) return message.channel.send(reply)

		const kingdom_name = args.join('-')
		await general.get('kingdoms').then(all_kingdoms => {
			if (all_kingdoms) {
				all_kingdoms.forEach(async kingdom => {
					const name = await kingdoms.get(`${kingdom}.name`)
					if (kingdom_name.toLowerCase() === name.toLowerCase()) reply = ':police_officer: That name is taken. Come up with an original name, please.'
				})
			}
		})

		if (reply) return message.channel.send(reply)

		if (!/^[a-zA-Z0-9-_]+$/.test(kingdom_name)) {
			return message.channel.send('Name is invalid. It must be 3-19 characters with A-Z/-_')
		}
		if (kingdom_name.length < 3) {
			return message.channel.send('Please specify a name. A good name has to be 3-19 characters long.')
		}
		if (kingdom_name.length > 20) {
			return message.channel.send('Wait. That\'s too long! Wayy too long. Please take a shorter name, 20+ characters is wayyyy too much trust me.')
		}

		let kingdom_id = ''
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
		for (let i = 0; i < 10; i++) kingdom_id += characters[Math.floor(Math.random() * characters.length)]

		message.channel.send(`😇 Just need a second to create your kingdom. ID: ${kingdom_id}`)
		const color = Math.floor(Math.random() * colors.id.length)

		const member = await message.guild.roles.create({ data: { name: `${kingdom_id} ≼🔅Member≽`, color: colors.id[color] } })

		const guard_king = await message.guild.roles.create({ data: { name: `${kingdom_id} ≪💠Guard/king≫`, color: colors.id[color] } })

		const public_permission = [{ id: guard_king, allow: ['ATTACH_FILES', 'EMBED_LINKS'] }, { id: message.guild.roles.everyone, deny: ['MENTION_EVERYONE', 'ATTACH_FILES', 'EMBED_LINKS'] }]

		const basic_permission = [{ id: guard_king, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: member, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]

		const restricted_permission = [{ id: guard_king, allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'MENTION_EVERYONE'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES'] }]

		const locked_permission = [{ id: guard_king, allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: member, allow: ['ADD_REACTIONS', 'VIEW_CHANNEL'] }, { id: message.guild.roles.everyone, deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'ATTACH_FILES', 'EMBED_LINKS'] }]

		let category = await autoProcessesChannelAdd([['category', colors.circle[color] + kingdom_name, false, 'Creating clan ' + kingdom_name, restricted_permission]], message.guild)
		category = category[0]

		await autoProcessesChannelAdd([
			['text', '🎯main', `${colors.book[color]} main info channel for your clan made by ${message.author.tag}`, 'Creating clan ' + kingdom_name, locked_permission, category.id],
			['text', colors.book[color] + 'chat', `Main channel for clan ${kingdom_name}`, 'Creating clan ' + kingdom_name, basic_permission, category.id],
			['text', colors.square[color] + 'chat seargent', `Chat channel for clan ${kingdom_name}`, 'Creating clan ' + kingdom_name, restricted_permission, category.id],
			['text', colors.heart[color] + 'border', `Border channel for clan ${kingdom_name}`, 'Creating clan ' + kingdom_name, public_permission, category.id]
		], message.guild)
		await message.member.roles.add(guard_king)
		await users.set(user_id + '.kingdom', kingdom_id)
		await users.set(user_id + '.role', 3)
		await general.push('kingdoms', kingdom_id)
		await kingdoms.set(kingdom_id + '.name', kingdom_name)
		await kingdoms.set(kingdom_id + '.color', color)
		await kingdoms.push(kingdom_id + '.members', user_id)
		await kingdoms.set(kingdom_id + '.owner', user_id)
		await kingdoms.set(kingdom_id + '.category', category.id)
		await kingdoms.set(kingdom_id + '.creationDate', (Date.now()))
		message.channel.send(`☑ I've created your kingdom:  ${colors.square[color]} **${kingdom_name}**`)
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
