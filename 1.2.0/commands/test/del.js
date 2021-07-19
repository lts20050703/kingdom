module.exports = {
  args: 1,
  owner_only: true,
  async run (bot, message, args) {
    let number = parseInt(args[0]) + 1
    if (number > 100) number = 100
    message.channel.bulkDelete(number, true)
  }
}
