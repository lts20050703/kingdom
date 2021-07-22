const { MessageEmbed } = require('discord.js')
const { owners } = require('../../lib')
const { version } = require('../../package.json')

module.exports = {
  aliases: ['ver', 'v'],
  async run (bot, message, args) {
    message.channel.send(new MessageEmbed()
      .setTimestamp()
      .setColor('#FF7F00')
      .setTitle(`Kingdoms Version: ${version}`)
      .setDescription(`Kingdoms Developers: ${owners.map(owner => bot.users.cache.get(owner).tag).join(', ')}`)
      .addField('Change Log:', 'New Commands! New Commands Handler! New Events Handler! New Cooldowns Handler\nIf you need help migrating and understanding new syntax @theo372005#2195\nOld Version 1.0.0 Commands Are In 1.0.0 folder')
    )
  }
}
