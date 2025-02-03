require('./insights').setup()
require('log-timestamp')
const { start, stop } = require('./messaging')
const { initialiseTables } = require('./storage')
const createServer = require('./server')

/* istanbul ignore next */
process.on(['SIGTERM', 'SIGINT'], async () => {
  await stop()
  process.exit(0)
})

module.exports = (async () => {
  await initialiseTables()
  await start()
  createServer()
    .then(server => server.start())
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
})()
