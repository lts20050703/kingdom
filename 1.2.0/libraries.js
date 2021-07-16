const chalk = require('chalk')

module.exports = {
  green: chalk.rgb(255, 255, 255).bgRgb(0, 127, 0),
  red: chalk.rgb(255, 255, 255).bgRgb(127, 0, 0),
  yellow: chalk.rgb(0, 0, 0).bgRgb(255, 255, 0),
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
