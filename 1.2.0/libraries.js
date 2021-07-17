const chalk = require('chalk')

module.exports = {
  // 0 error, 1 warn, 2 info ready
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
      default:
        console.log(chalk.rgb(0, 0, 0).bgRgb(127, 255, 0)(message))
    }
  },
  colors: {
    id: ['NOT_QUITE_BLACK', 'BLUE', 'BROWN', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'WHITE', 'YELLOW'],
    heart: ['🖤', '💙', '🤎', '💚', '🧡', '💜', '💓', '🤍', '💛'],
    square: ['⬛', '🟦', '🟫', '🟩', '🟧', '🟪', '🟥', '⬜', '🟨'],
    circle: ['⚫', '🔵', '🟤', '🟢', '🟠', '🟣', '🔴', '⚪', '🟡'],
    book: ['📓', '📘', '📔', '📗', '📙', '📖', '📕', '🔖', '📒']
  },
  gen_id (length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let id = ''
    for (let i = 0; i < length; i++) id += characters[Math.floor(Math.random() * characters.length)]
    return id
  }
}
