module.exports = {
  run (bot, message, args) {
    if (!args.length) return message.channel.send('No argument provided')
    let number = parseInt(args[0]) + 1
    if (number > 100) number = 100
    message.channel.bulkDelete(number, true)
  }
}
