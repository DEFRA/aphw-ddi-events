require('./insights').setup()
require('log-timestamp')
const { start, stop } = require('./messaging')
const { initialiseTables } = require('./storage')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await stop()
  process.exit(0)
})

module.exports = (async () => {
  await initialiseTables()
  await start()
})()
