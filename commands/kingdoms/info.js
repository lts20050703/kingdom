const ms = require('ms');
const { MessageEmbed } = require('discord.js');
const { colors, log } = require('../../lib');

module.exports = {
	async run (bot, message, args) {
		message.channel.send('Version 1.1.4.6 - Order: `No args -> Mention / User ID -> Nickname Starts With -> Username starts with -> Kingdom Name`');
		const { users, kingdoms, general } = bot.db;
		const embed = new MessageEmbed()
			.setTimestamp()
			.setColor('#ebe134')
			.setFooter(`Requested by ${message.author.tag} | Kingdoms™️`, message.author.displayAvatarURL({ dynamic: true }));

		let user_id;
		if (!args.length) user_id = message.author.id;
		else {
			for (const character of '<@!>') args[0] = args[0].replace(character, '');
			args = args.join(' ').toLowerCase().split(' ');
			if (message.guild.member(args[0])) user_id = args[0];
			else if (message.guild.members.cache.filter(member => member.displayName.toLowerCase().startsWith(args.join(' '))).size === 1) user_id = message.guild.members.cache.find(member => member.displayName.toLowerCase().startsWith(args[0])).id;
			else if (message.guild.members.cache.filter(member => member.user.tag.toLowerCase().startsWith(args.join(' '))).size === 1) user_id = message.guild.members.cache.find(member => member.user.name.toLowerCase().startsWith(args[0])).id;
		}

		if (user_id) {
			log(3, '[info.js] User ID 302 Found');
			const user_joined = `${ms(Date.now() - message.member.joinedTimestamp)} ago`;
			embed
				.setTitle('Info about user')
				.setThumbnail(message.guild.member(user_id).user.displayAvatarURL({ dynamic: true }))
				.addField('User', `<@${user_id}> (ID: ${user_id})`, true)
				.addField('User joined', user_joined, true);
			if (!await users.has(`${user_id}.kingdom`)) return message.channel.send(embed);
			log(4, '[Info.js] Kingdom 302 Found');
			const user = await users.get(user_id);
			const kingdom = await kingdoms.get(user.kingdom);

			let role;
			let all_members = 'Total members: ' + kingdom.members.length + '\n';
			for (const member of kingdom.members) {
				const member_role = await users.get(member + '.role');
				let role_name;
				if (member_role === 3) role_name = 'King';
				if (member_role === 2) role_name = 'Royal Guard';
				if (member_role === 1) role_name = 'Member';
				all_members += `<@${member}> (${role_name})\n`;
			}
			if (user.role === 3) role = 'King';
			if (user.role === 2) role = 'Royal Guard';
			if (user.role === 1) role = 'Member';
			const kingdom_created = kingdom.creationDate ? `${ms(Date.now() - kingdom.creationDate)} ago` : 'Unavailable';
			embed
				.addField('\u200b', '\u200b')
				.addField('Kingdom name', `${colors.circle[kingdom.color]} ${kingdom.name}`, true)
				.addField('Role in kingdom:', role, true)
				.addField('Kingdom owner:', `<@${kingdom.owner}>`, true)
				.addField('\u200b', '\u200b')
				.addField('Kingdom members', all_members, true)
				.addField('Kingdom created:', kingdom_created, true)
				.addField('Kingdom stats', '**Level:** soon™ \n**XP:** soon™', true);
			return message.channel.send({ embed });
		}

		// Checking for Kingdom Names
		const kingdom_ids = await general.get('kingdoms');
		let kingdom_id;
		for (const _kingdom_id of kingdom_ids) {
			const kingdom_name = await kingdoms.get(`${_kingdom_id}.name`);
			if (kingdom_name.toLowerCase() === args.join('-').toLowerCase()) kingdom_id = _kingdom_id;
		}
		if (kingdom_id) {
			log(3, '[Info.js] Found kingdom');
			const kingdom = await kingdoms.get(kingdom_id);
			let all_members = 'Total members: ' + kingdom.members.length + '\n';
			for (const member of kingdom.members) {
				const member_role = await users.get(member + '.role');
				let role_name;
				if (member_role === 3) role_name = 'King';
				if (member_role === 2) role_name = 'Royal Guard';
				if (member_role === 1) role_name = 'Member';
				all_members += `<@${member}> (${role_name})\n`;
			}
			const kingdom_creation_date = kingdom.creationDate ? `${ms(Date.now() - kingdom.creationDate)} ago` : 'Unavailable';
			embed
				.setTitle('Info about kingdom')
				.addField('Kingdom name:', `${colors.circle[kingdom.color]} ${kingdom.name}`, true)
				.addField('Kingdom owner:', `<@${kingdom.owner}>`, true)
				.addField('Kingdom members:', all_members, true)
				.addField('\u200b', '\u200b')
				.addField('Kingdom creation date:', kingdom_creation_date, true)
				.addField('Kingdom stats:', '**Level:** soon™ \n**XP:** soon™', true);
			return message.channel.send(embed);
		}

		if (message.guild.members.cache.filter(member => member.displayName.toLowerCase().startsWith(args.join(' '))).size > 1) return message.channel.send(`Multiple nicknames found (${message.guild.members.cache.filter(member => member.displayName.toLowerCase().startsWith(args.join(' '))).map(member => member.displayName).join(', ')})`);

		if (message.guild.members.cache.filter(member => member.user.tag.toLowerCase().startsWith(args.join(' '))).size > 1) return message.channel.send(`Multiple nicknames found (${message.guild.members.cache.filter(member => member.user.tag.toLowerCase().startsWith(args.join(' '))).map(member => member.user.tag).join(', ')})`);

		message.channel.send('Invalid Mention / User ID / Nickname / Username');
	}
};
