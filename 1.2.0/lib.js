const chalk = require('chalk')

module.exports = {
  colors: {
    id: ['NOT_QUITE_BLACK', 'BLUE', 'BROWN', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'WHITE', 'YELLOW'],
    square: ['⬛', '🟦', '🟫', '🟩', '🟧', '🟪', '🟥', '⬜', '🟨'],
    circle: ['⚫', '🔵', '🟤', '🟢', '🟠', '🟣', '🔴', '⚪', '🟡'],
    heart: ['🖤', '💙', '🤎', '💚', '🧡', '💜', '💓', '🤍', '💛'],
    book: ['📓', '📘', '📔', '📗', '📙', '📖', '📕', '🔖', '📒']
  },
  log (level, message) {
    switch (level) {
      case 0: console.log(chalk.rgb(255, 255, 255).bgRgb(127, 0, 0)(message)); break
      case 1: console.log(chalk.rgb(0, 0, 0).bgRgb(255, 255, 0)(message)); break
      case 2: console.log(chalk.rgb(255, 255, 255).bgRgb(0, 127, 0)(message)); break
    }
  },
  /**
   * Cancel Cooldown Set In message.js
   * @param {*} bot Pass bot
   * @param {*} user_id Pass message.author.id
   * @param {*} command_name Pass this.name
   * @example cancel_cooldown(bot.db.cooldowns, message.author.id, this.name)
   */
  cancel_cooldown (bot, user_id, command_name) {
    bot.cooldowns.get(command_name).delete(user_id)
    bot.db.cooldowns.delete(`${command_name}.${user_id}`)
  }
}
