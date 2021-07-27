const { MessageEmbed } = require('discord.js')
const { owners } = require('../../lib')

module.exports = {
	aliases: ['ver', 'v'],
	args: 1,
	async run (bot, message, args) {
		switch (args[0]) {
		case '1.2.0.0':
			return message.channel.send(new MessageEmbed()
				.setTimestamp()
				.setColor('#FF7F00')
				.setTitle('Kingdoms Version: 1.2.0.0')
				.setDescription(`Kingdoms Developers: ${owners.map(owner => bot.users.cache.get(owner).tag).join(', ')}`)
				.addField('Change Log:', 'kgd or kd prefix? now both works!\n' +
        'Doesn\'t work because mobile auto captialize kd into Kd? now also works\n' +
        'invite.js is left in the 1.0.0 folder because we need to make a proper working invite AND join command\n' +
        'help comamnd message changes because now we use our command handler\n' +
        'cooldown! by default 3 seconds, go and check your commands cooldown!\n' +
        'merge config.json and libraries.js into lib.js!\n' +
        'using chalk to color the console!\n' +
        'rename client.js into bot.js\n' +
        'merge db.js into bot.js\n' +
        'database login info is now stored in .env\n' +
        'Events handler! instead of a bunch of long bot.on() you can create different files for different events! 100% more module!\n' +
        'add a bunch of helper command like del (bulk delete messages) ping reload version (eval coming soon™️)\n' +
        'updated @[Admin] Real website code require() accordingly to file name changes\n' +
        'IT STILL WORKS! NOTHING BREAKS!')
			)
		case '1.2.0.1': return message.channel.send('Nothing changed.')
		default:
			return message.channel.send(new MessageEmbed()
				.setTimestamp()
				.setColor('#FF7F00')
				.setTitle('Kingdoms Version: 1.2.0.2')
				.setDescription(`Kingdoms Developers: ${owners.map(owner => bot.users.cache.get(owner).tag).join(', ')}`)
				.addField('Change Log:', 'Rename group test to group utils\nEslint Ignore 1.0.0')
			)
		}
	}
}
