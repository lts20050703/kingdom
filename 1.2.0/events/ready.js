const { log } = require('../libraries')
const { prefixes } = require('../config.json')

module.exports = {
  name: 'ready',
  once: true,
  execute (bot) {
    log(2, `✅ [Bot] Logged in as ${bot.user.tag}!`)
    bot.user.setActivity(`with your Kingdoms! | Do ${prefixes[0]} help`)
  }
}
