const { Database } = require('quickmongo')

const db = new Database('mongodb+srv://replit:fHbC5mKX9Rktir4f@kingdomsdb.3pnvk.mongodb.net/mainDB?retryWrites=true&w=majority')

db.on('ready', () => console.log('✅ [Database] Connected to MongoDB!'))
db.on('error', error => console.error(`❌ [Database] Error: ${error}`))

module.exports = {
  db,
  users: db.createModel('users'),
  kingdoms: db.createModel('kingdoms'),
  general: db.createModel('general'),
  sessions: db.createModel('sessions')
}
