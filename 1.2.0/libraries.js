const chalk = require('chalk')
module.exports = {
  colors: {
    id: ['NOT_QUITE_BLACK', 'BLUE', 'BROWN', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'WHITE', 'YELLOW'],
    heart: ['🖤', '💙', '🤎', '💚', '🧡', '💜', '💓', '🤍', '💛'],
    square: ['⬛', '🟦', '🟫', '🟩', '🟧', '🟪', '🟥', '⬜', '🟨'],
    circle: ['⚫', '🔵', '🟤', '🟢', '🟠', '🟣', '🔴', '⚪', '🟡'],
    book: ['📓', '📘', '📔', '📗', '📙', '📖', '📕', '🔖', '📒']
  },
  /**
   * console.log Color Message
   * @param {string|number} level Log Level, 0 or 'error' for red message, 1 or 'warn' for yellow message, 2 or 'info' or 'ready' for green message
   * @param {string} message The message to console.log color message
   * @returns console.log Color Message
   */
  log (level, message) {
    switch (level) {
      case 0:
      case 'error':
        console.log(chalk.rgb(255, 255, 255).bgRgb(127, 0, 0)(message))
        break
      case 1:
      case 'warn':
        console.log(chalk.rgb(0, 0, 0).bgRgb(255, 255, 0)(message))
        break
      case 2:
      case 'info':
      case 'ready':
        console.log(chalk.rgb(255, 255, 255).bgRgb(0, 127, 0)(message))
        break
    }
  },
  /**
   * Generate ID
   * @param {nunber} length Length of the ID
   * @returns ID
   */
  gen_id (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < length; i++) id += characters[Math.floor(Math.random() * characters.length)]
    return id
  },
  /**
   * check and set cooldown
   * @param {*} command The command. Pass this
   * @param {*} cooldowns The cooldowns Database. pass bot.db.cooldowns
   * @param {*} message The message. Pass message
   * @returns {boolean} true if on cooldown, false if NOT on cooldown
   */
  async cooldown (command, cooldowns, message) {
    const now = Date.now()
    const cooldown_amount = (command.cooldown || 3) * 1000

    if (await cooldowns.has(`${command.name}.${message.author.id}`)) {
      const expiration_time = await cooldowns.get(`${command.name}.${message.author.id}`) + cooldown_amount
      if (now < expiration_time) {
        const time_left = (expiration_time - now) / 1000
        message.reply(`Sorry, this command is on cooldown. Please try again in ${time_left.toFixed(1)}`)
        return true
      }
    }
    await cooldowns.set(`${command.name}.${message.author.id}`, now)
    return false
  }
}
