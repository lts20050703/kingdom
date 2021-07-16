const chalk = require('chalk')

module.exports = {
  name: 'ready',
  once: true,
  execute () {
    console.log(chalk.hex('#FFFFFF').bgHex('#007F00')('✅ [Bot]'))
  }
}
