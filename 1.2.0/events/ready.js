const chalk = require('chalk')
const { prefixes } = require('../config.json')

module.exports = {
  name: 'ready',
  once: true,
  execute (bot) {
    console.log(chalk.hex('#FFFFFF').bgHex('#007F00')(`✅ [Bot] Logged in as ${bot.user.tag}!`))
    bot.user.setActivity(`with your Kingdoms! | Do ${prefixes[0]} help`)
  }
}
