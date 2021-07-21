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
   * @param {*} level 0 Error 1 Warn 2 Info 3 Debug
   * @param {*} message
   */
  log (level, message) {
    switch (level) {
      case 0: console.log(`${chalk.bold.rgb(255, 0, 0)('[Error]:')} ${chalk.rgb(255, 0, 0)(message)}`); break
      case 1: console.log(`${chalk.bold.rgb(255, 255, 0)('[Warn]:')} ${chalk.rgb(255, 255, 0)(message)}`); break
      case 2: console.log(`${chalk.bold.rgb(0, 255, 0)('[Info]:')} ${chalk.rgb(0, 255, 0)(message)}`); break
      case 3: console.log(`${chalk.bold.rgb(0, 255, 255)('[Debug]:')} ${chalk.rgb(0, 255, 255)(message)}`); break
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
