module.exports = {
  owner_only: true,
  run (message, args) {
    this.success = true
    if (!args.length) return message.channel.send('No argument provided')
    let number = parseInt(args[0]) + 1
    if (number > 100) number = 100
    message.channel.bulkDelete(number, true)
  }
}
