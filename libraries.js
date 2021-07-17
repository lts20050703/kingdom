// hey this is cool plain chrisses libraries which are used for anything!

const { MessageEmbed } = require('discord.js')

module.exports = {
  // Part 1: CONSTANTS_VARIABLES
  colors: {
    id: ['NOT_QUITE_BLACK', 'BLUE', 'BROWN', 'GREEN', 'ORANGE', 'PURPLE', 'RED', 'WHITE', 'YELLOW'],
    heart: ['🖤', '💙', '🤎', '💚', '🧡', '💜', '💓', '🤍', '💛'],
    square: ['⬛', '🟦', '🟫', '🟩', '🟧', '🟪', '🟥', '⬜', '🟨'],
    circle: ['⚫', '🔵', '🟤', '🟢', '🟠', '🟣', '🔴', '⚪', '🟡'],
    book: ['📓', '📘', '📔', '📗', '📙', '📖', '📕', '🔖', '📒']
  },

  // Part 2: Function() PascalCase
  Send (channel, message, deleteTime, files = false) {
    if (message === '') throw new Error('Empty text')
    if (channel.guild) {
      if (!channel.permissionsFor(channel.guild.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])) return console.log('Were not allowed to send a message.')
    }
    if (deleteTime) throw Error('DelMessage() Is Not Yet Defined')
    // TODO @chris please make a DelMessage function
    // if (deleteTime) return channel.send(message, { disableMentions: 'everyone' }).then(sentMessage => { DelMessage(sentMessage, deleteTime, 'Automated deletion after sending.') })

    if (files) return channel.send(message, { disableMentions: 'everyone', files: files })
    if (typeof (message) === 'string') return channel.send(message, { disableMentions: 'everyone' })
    return channel.send(message)
  },

  EmbedGen (channel = false, title = false, fields = false, author = false, footer = false, color = false, thumbnail = false, desc = false, timestamp = false, titleUrl = false) {
    try {
      const embed = new MessageEmbed()
      if (channel !== 'image') {
        if (title) embed.title = title
        if (fields) embed.addFields(fields)
        if (author) embed.setAuthor(author[0], author[1], author[2]) // Name, icon URl, URL
        if (Array.isArray(footer)) embed.setFooter(footer[0], footer[1])
        else if (footer) embed.setFooter(footer)
        if (timestamp) embed.setTimestamp(timestamp)
        if (color) embed.color = color
        else embed.color = Math.floor(Math.random() * 16777215)
        if (thumbnail) embed.setThumbnail(thumbnail)
        if (titleUrl) embed.setURL(titleUrl)
        if (desc) embed.setDescription(desc)
      } else if (channel === 'image') {
        const image = title
        author = fields
        if (image) embed.setImage(image)
        if (author) embed.setAuthor(author[0], author[1], author[2]) // Name, icon URl, URL
        if (color) embed.color = color
        else embed.color = Math.floor(Math.random() * 16777215)
      }
      return embed
    } catch (e) {
      if (channel) return channel.send('``EMBED ERROR``\n```xl\n' + e + '```')
    }
  },
  // embedGen(message.channel, `title`, [{name:`field title`,value:`field name`,inline:false}], [message.author.username], `footer`, 41215)

  timeToText (input, inputType = 's', format = 'NORMAL', precise = false, outputLims = false) {
    if (inputType === 'ms' && !precise) input = Math.floor(input / 1000)
    if (inputType === 'ms' && precise) input = input / 1000

    const centuries = Math.floor(input / (3600 * 24 * 36500)); input -= centuries * (3600 * 24 * 36500)
    const years = Math.floor(input / (3600 * 24 * 365)); input -= years * (3600 * 24 * 365)
    const months = Math.floor(3600 / (3600 * 24 * 30)); input -= months * (3600 * 24 * 30)
    const days = Math.floor(input / (3600 * 24)); input -= days * (3600 * 24)
    const hrs = Math.floor(input / (3600)); input -= hrs * (3600)
    const mins = Math.floor(input / (60)); input -= mins * (60)
    const s = Math.floor(input); input -= s
    const ms = Math.floor(input * 1000); input -= ms * (0.001)
    const micros = Math.floor(input * 1000000); input -= micros * (0.000001)

    let time = []
    function PushTime (count, type) {
      if (count === 1) time.push((count + type).replace('<>', '').replace('<y>', 'y'))
      else time.push((count + type).replace('<>', 's').replace('<y>', 'ies'))
    }
    if (precise && micros !== 0) PushTime(micros, ' μs')
    if (ms !== 0) PushTime(ms, ' ms')
    if (s !== 0) PushTime(s, ' second<>')
    if (mins !== 0) PushTime(mins, ' minute<>')
    if (hrs !== 0) PushTime(hrs, ' hour<>')
    if (days !== 0) PushTime(days, ' day<>')
    if (months !== 0) PushTime(months, ' month<>')
    if (years !== 0) PushTime(years, ' year<>')
    if (centuries !== 0) PushTime(centuries, ' centur<y>')
    if (time.length === 0) PushTime(0, ' seconds')
    if (outputLims) time = time.slice(-outputLims)
    time = time.reverse().join(', ')
    if (format === 'SHORT') time = time.replace('seconds', 'secs').replace('minutes', 'mins').replace('hours', 'hrs').replace('days', 'dys').replace('months', 'mths').replace('years', 'yrs').replace('centuries', 'cts').replace('second', 'sec').replace('minute', 'min').replace('hour', 'hr').replace('day', 'dy').replace('month', 'mth').replace('year', 'yr').replace('century', 'ct')
    return time
  },
  // USAGE: `${timeToText(Date.now()-lastTime, 'ms', 'normal', false, 2)} ago.`

  getMember (txt, guild = false, returnMember, client) {
    // No guild -> Global.

    let match = false
    let matchCount = 0
    let matchName = false
    let matchNameCount = false
    txt = txt.replace('<@!', '').replace('<@', '').replace('>', '')
    // let memberList = client.users.cache
    let memberList
    if (guild) memberList = guild.members.cache
    for (let e of memberList) {
      e = e[1]
      if (!match && e.id === txt) match = e.id
      if (guild && e.user.discriminator === txt) {
        match = e.id
        matchCount++
      }
      if (!guild && e.discriminator === txt) {
        match = e.id
        matchCount++
      }
    }
    if (!match) {
      for (let e of memberList) {
        e = e[1]
        let username = ''
        if (guild) username = e.user.username.toLowerCase()
        else username = e.username.toLowerCase()

        if (guild && txt.length >= 2 && username.slice(0, txt.length) === txt.toLowerCase()) {
          match = e.id
          matchCount++
        }
        if (!guild && txt.length >= 4 && username.slice(0, txt.length) === txt.toLowerCase()) {
          match = e.id
          matchCount++
        }
        if (username === txt.toLowerCase()) {
          matchName = e.id
          matchNameCount++
        }
      }
      if (matchNameCount === 1) {
        match = matchName
        matchCount = 0
      }
    }

    if (!match || matchCount > 1) return false
    if (guild && returnMember) return guild.members.cache.get(match)
    else if (guild) return guild.members.cache.get(match).user
    else return client.users.cache.get(match)
  }
// Usage: member = getMember(args.join(` `), message.guild, false)`
// replace false with true so it returns guild member instead of user
}
