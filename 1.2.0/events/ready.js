const { log, prefixes } = require('../config')

module.exports = {
  run (bot) {
    log(2, `[Bot]: Logged in as ${bot.user.tag}!`)
    bot.user.setActivity(`with your Kingdoms! | Do ${prefixes[0]} help`)
  }
}
