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
  }
}
