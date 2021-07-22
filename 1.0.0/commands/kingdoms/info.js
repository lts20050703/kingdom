const { Command } = require('discord.js-commando')
const libraries = require('../../libraries.js')
const { colors } = require('../../libraries')

module.exports = class invite extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      group: 'kingdoms',
      memberName: 'info',
      description: 'Get info about a kingdom or a user.',
      args: [{
        key: 'thing',
        prompt: 'Tag a user (or enter his ID) / or a kingdom name!',
        type: 'string',
        default: ''
      }]
    })
  }

  async run (message, { thing }) {
    const { db } = message.client
    const users = db.createModel('users')
    const kingdoms = db.createModel('kingdoms')
    const general = db.createModel('general')
    // Test if thing is a member
    thing = thing.toLowerCase().replace('<@', '').replace('>', '').replace('!', '')
    const guild = message.client.guilds.cache.get(message.guild.id)
    if (guild.member(thing) || libraries.getMember(thing, message.guild, false, this.client)) {
      if (!guild.member(thing)) thing = libraries.getMember(thing, message.guild, false, this.client).id
      thing = thing.toLowerCase().replace('<@', '').replace('>', '').replace('!', '')
      console.log(libraries.getMember(thing, message.guild, false, this.client))
      // there is a GuildMember with that ID
      const userInfo = await this.client.users.fetch(thing)
        .catch(console.error)
      var imgURL = userInfo.displayAvatarURL()
      if (await users.get(thing + '.kingdom')) {
        var userKingdomInfo = await users.get(thing)
          .catch((e) => {
            return message.say('There was an error trying to run this command!')
          })
        var kingdom = userKingdomInfo.kingdom
        var kingdomInfo = await kingdoms.get(kingdom)
          .catch((e) => {
            return message.say('There was an error trying to run this command!')
          })
        const kingdomEpoch = 1624385650000
        let kgdcreationdate = 'Unavailable'
        if (kingdomInfo.creationDate != undefined) kgdcreationdate = '' + libraries.timeToText(Date.now() - kingdomEpoch - kingdomInfo.creationDate, 'ms', 'normal', false, 2) + ' ago.' // If this line does not works, just disable it.
        let userJoinedAt = 'Could not determine.'
        userJoinedAt = libraries.timeToText(Date.now() - message.guild.members.cache.get(thing).joinedAt, 'ms', 'normal', false, 3) + ' ago.'
        var role
        var allMembers = 'Total members: ' + kingdomInfo.members.length + '\n'
        for (const member of kingdomInfo.members) {
          var mbrole = await users.get(member + '.role')
          var role2
          if (mbrole == 3) role2 = 'King'
          if (mbrole == 2) role2 = 'Royal Guard'
          if (mbrole == 1) role2 = 'Member'
          allMembers = allMembers + '<@' + member + '> (' + role2 + ') \n'
        }
        if (userKingdomInfo.role == 3) role = 'King'
        if (userKingdomInfo.role == 2) role = 'Royal Guard'
        if (userKingdomInfo.role == 1) role = 'Member'
        const embed = {
          color: '#ebe134',
          title: 'Info about user',
          thumbnail: {
            url: imgURL
          },
          fields: [
            {
              name: 'User:',
              value: '<@' + thing + '> (ID: ' + thing + ')',
              inline: true
            },
            {
              name: 'Join date:',
              value: userJoinedAt,
              inline: true
            },
            {
              name: 'Is on a Kingdom?',
              value: 'Yes',
              inline: true
            },
            {
              name: '\u200b',
              value: '\u200b',
              inline: false
            },
            {
              name: 'Kingdom name:',
              value: colors.circle[kingdomInfo.color] + ' ' + kingdomInfo.name,
              inline: true
            },
            {
              name: 'Role on Kingdom:',
              value: role,
              inline: true
            },
            {
              name: 'Kingdom owner:',
              value: '<@' + kingdomInfo.owner + '>',
              inline: true
            },
            {
              name: '\u200b',
              value: '\u200b',
              inline: false
            },
            {
              name: 'Kingdom members:',
              value: allMembers,
              inline: true
            },
            {
              name: 'Kingdom creation date:',
              value: kgdcreationdate,
              inline: true
            },
            {
              name: 'Kingsom stats:',
              value: '**Level:** soon™ \n**XP:** soon™',
              inline: true
            }
          ],
          timestamp: new Date(),
          footer: {
            text: 'Requested by ' + message.author.tag + ' | © Kingdoms 2020',
            icon_url: message.author.avatarURL()
          }
        }
        message.channel.send({ embed })
        return
      } else {
        const embed = {
          color: '#ebe134',
          title: 'Info about user',
          thumbnail: {
            url: imgURL
          },
          fields: [
            {
              name: 'User:',
              value: '<@' + thing + '> (ID: ' + thing + ')',
              inline: true
            },
            {
              name: 'Join date:',
              value: message.guild.members.cache.get(thing).joinedAt,
              inline: true
            },
            {
              name: 'Is on a Kingdom?',
              value: 'No',
              inline: true
            }
          ],
          timestamp: new Date(),
          footer: {
            text: 'Requested by ' + message.author.tag + ' | © Kingdoms 2020',
            icon_url: message.author.avatarURL()
          }
        }
        message.channel.send({ embed })
        return
      }
    }
    thing = thing.split(' ').join('-')
    const allKingdoms = await general.get('kingdoms').catch((e) => console.log(e))
    let found = false
    for (const kingdom of allKingdoms) {
      const thisName = await kingdoms.get(kingdom + '.name').catch((e) => console.log(e))
      if (thisName.toLowerCase() == thing.toLowerCase()) found = kingdom
    }
    if (found != false) {
      console.log('found it')
      var kingdom = found
      thing = found
      var kingdomInfo = await kingdoms.get(kingdom).catch((e) => console.log(e))
      const kingdomEpoch = 1624385650000
      let kgdcreationdate = 'Unavailable'
      if (kingdomInfo.creationDate != undefined) kgdcreationdate = '' + libraries.timeToText(Date.now() - kingdomEpoch - kingdomInfo.creationDate, 'ms', 'normal', false, 2) + ' ago.' // If this line does not works, just disable it.
      var allMembers = 'Total members: ' + kingdomInfo.members.length + '\n'
      for (const member of kingdomInfo.members) {
        var mbrole = await users.get(member + '.role')
        var role2
        if (mbrole == 3) role2 = 'King'
        if (mbrole == 2) role2 = 'Royal Guard'
        if (mbrole == 1) role2 = 'Member'
        allMembers = allMembers + '<@' + member + '> (' + role2 + ') \n'
      }
      const embed = {
        color: '#ebe134',
        title: 'Info about kingdom',
        fields: [
          {
            name: 'Kingdom name:',
            value: colors.circle[kingdomInfo.color] + ' ' + kingdomInfo.name,
            inline: true
          },
          {
            name: 'Kingdom owner:',
            value: '<@' + kingdomInfo.owner + '>',
            inline: true
          },
          {
            name: 'Kingdom members:',
            value: allMembers,
            inline: true
          },
          {
            name: '\u200b',
            value: '\u200b',
            inline: false
          },
          {
            name: 'Kingdom creation date:',
            value: kgdcreationdate,
            inline: true
          },
          {
            name: 'Kingsom stats:',
            value: '**Level:** soon™ \n**XP:** soon™',
            inline: true
          }
        ],
        timestamp: new Date(),
        footer: {
          text: 'Requested by ' + message.author.tag + ' | © Kingdoms 2020',
          icon_url: message.author.avatarURL()
        }
      }
      message.channel.send({ embed })
    } else {
      if (thing != '') {
        // message.say('The argument you provided is not a user or a Kingdom name, therefore I\'m showing you your info.')
        message.say('The argument you provided is not a valid user or a Kingdom name.')
        return
      }
      thing = message.author.id
      // there is a GuildMember with that ID
      const userInfo = await this.client.users.fetch(thing)
        .catch(console.error)
      var imgURL = userInfo.displayAvatarURL()
      if (await users.get(thing + '.kingdom')) {
        var userKingdomInfo = await users.get(thing)
          .catch((e) => {
            return message.say('There was an error trying to run this command!')
          })
        var kingdom = userKingdomInfo.kingdom
        var kingdomInfo = await kingdoms.get(kingdom)
          .catch((e) => {
            return message.say('There was an error trying to run this command!')
          })
        const kingdomEpoch = 1624385650000
        let kgdcreationdate = 'Unavailable'
        if (kingdomInfo.creationDate != undefined) kgdcreationdate = '' + libraries.timeToText(Date.now() - kingdomEpoch - kingdomInfo.creationDate, 'ms', 'normal', false, 2) + ' ago.' // If this line does not works, just disable it.
        let userJoinedAt = 'Could not determine.'
        userJoinedAt = libraries.timeToText(Date.now() - message.guild.members.cache.get(thing).joinedAt, 'ms', 'normal', false, 3) + ' ago.'
        var role
        var allMembers = 'Total members: ' + kingdomInfo.members.length + '\n'
        for (const member of kingdomInfo.members) {
          var mbrole = await users.get(member + '.role')
          var role2
          if (mbrole == 3) role2 = 'King'
          if (mbrole == 2) role2 = 'Royal Guard'
          if (mbrole == 1) role2 = 'Member'
          allMembers = allMembers + '<@' + member + '> (' + role2 + ') \n'
        }
        if (userKingdomInfo.role == 3) role = 'King'
        if (userKingdomInfo.role == 2) role = 'Royal Guard'
        if (userKingdomInfo.role == 1) role = 'Member'
        const embed = {
          color: '#ebe134',
          title: 'Info about user',
          thumbnail: {
            url: imgURL
          },
          fields: [
            {
              name: 'User:',
              value: '<@' + thing + '> (ID: ' + thing + ')',
              inline: true
            },
            {
              name: 'Join date:',
              value: userJoinedAt,
              inline: true
            },
            {
              name: 'Is on a Kingdom?',
              value: 'Yes',
              inline: true
            },
            {
              name: '\u200b',
              value: '\u200b',
              inline: false
            },
            {
              name: 'Kingdom name:',
              value: colors.circle[kingdomInfo.color] + ' ' + kingdomInfo.name,
              inline: true
            },
            {
              name: 'Role on Kingdom:',
              value: role,
              inline: true
            },
            {
              name: 'Kingdom owner:',
              value: '<@' + kingdomInfo.owner + '>',
              inline: true
            },
            {
              name: '\u200b',
              value: '\u200b',
              inline: false
            },
            {
              name: 'Kingdom members:',
              value: allMembers,
              inline: true
            },
            {
              name: 'Kingdom creation date:',
              value: kgdcreationdate,
              inline: true
            },
            {
              name: 'Kingsom stats:',
              value: '**Level:** soon™ \n**XP:** soon™',
              inline: true
            }
          ],
          timestamp: new Date(),
          footer: {
            text: 'Requested by ' + message.author.tag + ' | © Kingdoms 2020',
            icon_url: message.author.avatarURL()
          }
        }
        message.channel.send({ embed })
      } else {
        const embed = {
          color: '#ebe134',
          title: 'Info about user',
          thumbnail: {
            url: imgURL
          },
          fields: [
            {
              name: 'User:',
              value: '<@' + thing + '> (ID: ' + thing + ')',
              inline: true
            },
            {
              name: 'Join date:',
              value: message.guild.members.cache.get(thing).joinedAt,
              inline: true
            },
            {
              name: 'Is on a Kingdom?',
              value: 'No',
              inline: true
            }
          ],
          timestamp: new Date(),
          footer: {
            text: 'Requested by ' + message.author.tag + ' | © Kingdoms 2020',
            icon_url: message.author.avatarURL()
          }
        }
        message.channel.send({ embed })
      }
    }
  }
}
