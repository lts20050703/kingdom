const ms = require('ms')
const { MessageEmbed } = require('discord.js')
const { log, colors } = require('../../lib')

module.exports = {
  description: 'Get info about a kingdom or a user.',
  async run (bot, message, args) {
    message.channel.send('Version 1.1.4.2 - If you found any bug please @theo372005#2195')
    const { users, kingdoms, general } = bot.db
    const embed = new MessageEmbed()
      .setTimestamp()
      .setColor('#ebe134')
      .setFooter(`Requested by ${message.author.tag} | © Kingdoms 2020`, message.author.displayAvatarURL({ dynamic: true }))
    // Checking for no args or user ID or username
    if (!args.length || message.guild.member(args[0].replace('<@', '').replace('!', '').replace('>', '')) || message.guild.members.cache.filter(member => member.displayName.toLowerCase().startsWith(args.join(' ').toLowerCase())).size === 1) {
      if (!args.length) args[0] = message.author.id
      else if (message.guild.member(args[0].replace('<@', '').replace('!', '').replace('>', ''))) args[0] = message.guild.member(args[0].replace('<@', '').replace('!', '').replace('>', '')).id
      else if (message.guild.members.cache.filter(member => member.displayName.toLowerCase().startsWith(args.join(' ').toLowerCase())).size === 1) args[0] = message.guild.members.cache.filter(member => member.displayName.toLowerCase().startsWith(args.join(' ').toLowerCase())).first().id
      log(3, '[Info.js] No args / User ID / Username')
      const user_joined = `${ms(Date.now() - message.member.joinedTimestamp)} ago`
      embed
        .setTitle('Info about user')
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField('User', `<@${args[0]}> (ID: ${args[0]})`, true)
        .addField('User joined', user_joined, true)
      if (!await users.has(`${args[0]}.kingdom`)) {
        log(3, '[Info.js] Kingdom: false')
        embed.addField('Is on a kingdom?', 'no', true)
        return message.channel.send(embed)
      }
      log(3, '[Info.js] Kingdom: true')
      const user = await users.get(args[0])
      const kingdom = await kingdoms.get(user.kingdom)

      let role
      let all_members = 'Total members: ' + kingdom.members.length + '\n'
      for (const member of kingdom.members) {
        const member_role = await users.get(member + '.role')
        let role_name
        if (member_role === 3) role_name = 'King'
        if (member_role === 2) role_name = 'Royal Guard'
        if (member_role === 1) role_name = 'Member'
        all_members += `<@${member}> (${role_name})\n`
      }
      if (user.role === 3) role = 'King'
      if (user.role === 2) role = 'Royal Guard'
      if (user.role === 1) role = 'Member'
      const kingdom_created = kingdom.creationDate ? `${ms(Date.now() - kingdom.creationDate)} ago` : 'Unavailable'
      embed
        .addField('Is on a kingdom?', 'yes', true)
        .addField('\u200b', '\u200b')
        .addField('Kingdom name', `${colors.circle[kingdom.color]} ${kingdom.name}`, true)
        .addField('Role in kingdom:', role, true)
        .addField('Kingdom owner:', `<@${kingdom.owner}>`, true)
        .addField('\u200b', '\u200b')
        .addField('Kingdom members', all_members, true)
        .addField('Kingdom created:', kingdom_created, true)
        .addField('Kingdom stats', '**Level:** soon™ \n**XP:** soon™', true)
      return message.channel.send({ embed })
    }
    // Checking for Kingdom Names
    const kingdom_ids = await general.get('kingdoms')
    let kingdom_id
    for (const _kingdom_id of kingdom_ids) {
      const kingdom_name = await kingdoms.get(`${_kingdom_id}.name`)
      if (kingdom_name.toLowerCase() === args.join('-').toLowerCase()) kingdom_id = _kingdom_id
    }
    if (kingdom_id) {
      log(3, '[Info.js] Found kingdom')
      const kingdom = await kingdoms.get(kingdom_id)
      let all_members = 'Total members: ' + kingdom.members.length + '\n'
      for (const member of kingdom.members) {
        const member_role = await users.get(member + '.role')
        let role_name
        if (member_role === 3) role_name = 'King'
        if (member_role === 2) role_name = 'Royal Guard'
        if (member_role === 1) role_name = 'Member'
        all_members += `<@${member}> (${role_name})\n`
      }
      const kingdom_creation_date = kingdom.creationDate ? `${ms(Date.now() - kingdom.creationDate)} ago` : 'Unavailable'
      embed
        .setTitle('Info about kingdom')
        .addField('Kingdom name:', `${colors.circle[kingdom.color]} ${kingdom.name}`, true)
        .addField('Kingdom owner:', `<@${kingdom.owner}>`, true)
        .addField('Kingdom members:', all_members, true)
        .addField('\u200b', '\u200b')
        .addField('Kingdom creation date:', kingdom_creation_date, true)
        .addField('Kingdom stats:', '**Level:** soon™ \n**XP:** soon™', true)
      return message.channel.send(embed)
    }
  }
}
