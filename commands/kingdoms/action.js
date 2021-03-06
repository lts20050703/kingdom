const ms = require('ms');
const { MessageEmbed, Collection } = require('discord.js');
const { delete_cooldown } = require('../../lib');
module.exports = {
	aliases: ['act'],
	cooldown: '30s',
	async run (bot, message, args) {
		const { id: user_id } = message.author;
		if (!args.length) {
			delete_cooldown(bot, message.author.id, this.name);
			message.channel.send(new MessageEmbed().addField('Unlocked Actions:', 'repair|build|xp').setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })).setColor('6718ce'));
			return;
		}

		// checking cooldown
		if (!bot.cooldowns2.has(this.name)) bot.cooldowns2.set(this.name, new Collection());

		const now = Date.now();
		const timestamps = bot.cooldowns2.get(this.name);

		const last_used = timestamps.get(message.author.id) || bot.db.cooldowns2.get(`${this.name}.${message.author.id}`) - Date.now();

		timestamps.set(message.author.id, now);
		bot.db.cooldowns2.set(`${this.name}.${message.author.id}`, now);

		const in_clan = true;
		// TODO resources and exp should be set according to real vars
		const exp = 13;
		let count = 5;
		let bonus = '';
		if (last_used <= ms('-15m')) {
			count = 10;
			bonus = ' [15 mins+ bonus]';
		}
		if (last_used <= ms('-1h')) {
			count = 15;
			bonus = ' [hourly x3]';
		}
		if (last_used <= ms('-12h')) {
			count = 20;
			bonus = ' [12 hours+ bonus]';
		}
		if (last_used <= ms('-1d')) {
			count = Math.floor(25 * (1 + last_used / (-3600 * 24)) ** 0.5);
			bonus = ' [long offline inactivity]';
		}
		let r = [false, false, false];
		switch (args[0]) {
		case 'xp':
		case 'exp':
		case 'experience':
			r = acting('xp', count, exp, in_clan);
			break;
		case 'build':
			r = acting('build', count, exp, in_clan);
			break;
		case 'repair':
		case 'heal':
			r = acting('repair', count, exp, in_clan);
			break;
		}
		if (r[0]) timedUsers[user_id] = Date.now() - KINGDOM_EPOCH + 30000;
		if (!r[0] && !r[1] && !r[2]) {
			delete_cooldown(bot, message.author.id, this.name);
			return message.channel.send(new MessageEmbed().setTitle('Invalid Action').setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })).setColor('6718ce'));
		}

		message.channel.send(new MessageEmbed().setTitle(r[1]).addFields(r[2]).setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })).setColor('6718ce').setDescription(`Multiplier: x${count / 5}${bonus}`));
	}
};

const KINGDOM_EPOCH = 1624385650000;
const timedUsers = {};
/**
 * Helper Act Function
 * @param {string} actType type of act, xp | build | repair
 * @param {number} count idk what this parameter mean ask chriscj
 * @param {number} exp Experience
 * @param {boolean} IN_CLAN in clan?
 * @returns [worked?, title, fields]
 */
function acting (actType, count, exp, IN_CLAN) {
	// Return:  [worked?, `title`, fields
	const knownLevel = 1;
	const alreadyxp = 10;
	let r = [false, false, false];
	switch (actType) {
	case 'xp':
	case 'exp':
	case 'experience':
		// TODO:  push +count xp in the user database
		if (!IN_CLAN) r = [true, 'SOLO GAIN EXP', [{ name: 'You got ', value: `${count} xp!\n` + showLevel(alreadyxp + count, knownLevel) }]];
		else {
			r = [true, 'GAIN EXP', [{ name: 'You got ', value: `${count} xp! Your guild got ${count * 3} xp!\n` + showLevel(alreadyxp + count, knownLevel, false) }]];
		}
		break;
	case 'build':
		if (!IN_CLAN) r = [false, false, [{ name: 'Invalid Action', value: 'Please join a kingdom first!' }]];
		else {
			const gainXp = Math.floor(count * 0.6);
			r = [true, 'Build', [{ name: 'Build Status:', value: `Build index is now ${count * 5}!\nYou spent ${count}\\????` + showLevel(alreadyxp + gainXp, knownLevel, true) }]];
		}
		break;
	case 'repair':
	case 'heal':
		if (!IN_CLAN) r = [false, false, [{ name: 'Invalid Action', value: 'You can not repair a kingdom if you are not in one!' }]];
		else {
			const gainXp = Math.floor(count * 0.6);
			r = [true, 'Repair', [{ name: 'Repair Status:', value: `Your guild is now at ${24500 + count * 5}????` + showLevel(alreadyxp + gainXp, knownLevel, true) }]];
		}
		break;
	}
	return r;
}

function showLevel (xp, knownLevel, onlyLevelUp) {
	const curLevel = Math.floor((0.1 * xp) ** 0.5);

	const diffXP = (knownLevel ** 2) * 10;
	const maxXP = (((knownLevel + 1) ** 2) * 10 - diffXP);
	const realXP = (xp - diffXP);
	// const QTT = realXP / maxXP
	// You need '+(maxXP-realXP)+ ' more xp to go to the next level.
	let txt = `You are level ${curLevel} [`;
	txt += ''.padEnd(Math.floor(5 * (Math.min(realXP / maxXP, 1))), '???');
	txt += ''.padEnd(Math.ceil(5 * (Math.min(1 - realXP / maxXP, 1))), '???');
	txt += `] ${realXP}/${maxXP}`;

	if (onlyLevelUp) txt = '';
	if (knownLevel < curLevel) txt += `\n**LEVEL UP!** You are now level **${curLevel}**`;
	return txt;
	// /!\ This function must become ABLE to push the new known curLevel after declaring it
	// It can happen the player get to a new level w/o being informed. He would only be informed once showLevel () is run!
}
