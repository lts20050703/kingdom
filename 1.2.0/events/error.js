const { red } = require('../libraries')

module.exports = {
  name: 'error',
  once: false,
  execute (error) {
    console.error(red(`❌ [Bot] Error: ${error}`))
  }
}
