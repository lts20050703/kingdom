const chalk = require('chalk')

module.exports = {
  name: 'error',
  once: false,
  execute (error) {
    console.error(chalk.hex('#FFFFFF').bgHex('#7F0000')(`❌ [Bot] Error: ${error}`))
  }
}
