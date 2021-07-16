const { green } = require('../libraries')
const { prefixes } = require('../config.json')

module.exports = {
  name: 'ready',
  once: true,
  execute (bot) {
    console.log(green(`✅ [Bot] Logged in as ${bot.user.tag}!`))
    bot.user.setActivity(`with your Kingdoms! | Do ${prefixes[0]} help`)
  }
}
