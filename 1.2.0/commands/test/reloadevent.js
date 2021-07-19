const { readdirSync } = require('fs')

module.exports = {
  description: 'Reloads a event',
  owner_only: true,
  run (message, args, bot) {
    this.success = false

    if (!args.length) return message.channel.send('No argument provided')
    const event_name = args[0]
    const events = readdirSync('./events')
    if (!events.includes(`${event_name}.js`)) return message.channel.send(`There is no event with name ${event_name}`)
    delete require.cache[require.resolve(`../../events/${event_name}.js`)]
    const new_event = require(`../../events/${event_name}.js`)
    bot.removeAllListeners(event_name)
    bot.on(event_name, message => new_event.run(message, bot))
    message.channel.send(`Event ${event_name} was reloaded!`)

    this.success = true
  }
}
