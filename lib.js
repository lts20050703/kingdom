const chalk = require('chalk');

module.exports = {
	prefixes: ['kd', 'kgd'],
	owners: ['379643682984296448', '401450759981629450', '472327239661518848'],
	colors: {
		id: ['NOT_QUITE_BLACK', 'BLUE', 'BROWN', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'WHITE', 'YELLOW'],
		square: ['โฌ', '๐ฆ', '๐ซ', '๐ฉ', '๐ง', '๐ช', '๐ฅ', 'โฌ', '๐จ'],
		circle: ['โซ', '๐ต', '๐ค', '๐ข', '๐ ', '๐ฃ', '๐ด', 'โช', '๐ก'],
		heart: ['๐ค', '๐', '๐ค', '๐', '๐งก', '๐', '๐', '๐ค', '๐'],
		book: ['๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐', '๐']
	},
	/**
   * @param {*} level 0: Error | 1: Warn | 2: Info
   * @param {*} message
   */
	log (level, message) {
		switch (level) {
		case 0: return console.log(`${chalk.bold.hex('#000000').bgHex('#FF0000')(' [Error]: ')} ${message}`);
		case 1: return console.log(`${chalk.bold.hex('#000000').bgHex('#FFFF00')(' [Warn]: ')} ${message}`);
		case 2: return console.log(`${chalk.bold.hex('#000000').bgHex('#00FF00')(' [Info]: ')} ${message}`);
		}
	},
	/**
   * @param {*} bot Pass bot
   * @param {*} user_id Pass message.author.id
   * @param {*} command_name Pass this.name
   * @example delete_cooldown(bot, message.author.id, this.name)
   */
	delete_cooldown (bot, user_id, command_name) {
		bot.cooldowns.get(command_name).delete(user_id);
		bot.db.cooldowns.delete(`${command_name}.${user_id}`);
	}
};
