const chalk = require('chalk')

module.exports = {
  prefixes: ['kd'],
  owners: ['379643682984296448', '401450759981629450', '472327239661518848'],
  colors: {
    id: ['NOT_QUITE_BLACK', 'BLUE', 'BROWN', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'WHITE', 'YELLOW'],
    square: ['⬛', '🟦', '🟫', '🟩', '🟧', '🟪', '🟥', '⬜', '🟨'],
    circle: ['⚫', '🔵', '🟤', '🟢', '🟠', '🟣', '🔴', '⚪', '🟡'],
    heart: ['🖤', '💙', '🤎', '💚', '🧡', '💜', '💓', '🤍', '💛'],
    book: ['📓', '📘', '📔', '📗', '📙', '📖', '📕', '🔖', '📒']
  },
  /**
   * @param {*} level 0: Error | 1: Warn | 2: Info
   * @param {*} message
   */
  log (level, message) {
    switch (level) {
      case 0: console.log(`${chalk.bold.hex('#000000').bgHex('#FF0000')(' [Error]: ')} ${message}`); break
      case 1: console.log(`${chalk.bold.hex('#000000').bgHex('#FFFF00')(' [Warn]: ')} ${message}`); break
      case 2: console.log(`${chalk.bold.hex('#000000').bgHex('#00FF00')(' [Info]: ')} ${message}`); break
    }
  },
  /**
   * @param {*} bot Pass bot
   * @param {*} user_id Pass message.author.id
   * @param {*} command_name Pass this.name
   * @example cancel_cooldown(bot, message.author.id, this.name)
   */
  cancel_cooldown (bot, user_id, command_name) {
    bot.cooldowns.get(command_name).delete(user_id)
    bot.db.cooldowns.delete(`${command_name}.${user_id}`)
  }
}
