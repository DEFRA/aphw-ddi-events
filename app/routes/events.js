const { getEvents } = require('../repos/events')
const { timingLog } = require('../lib/log-helper')

module.exports = {
  method: 'GET',
  path: '/events',
  handler: async (request, h) => {
    let logTime = timingLog('/events route start 1')
    const pks = request.query.pks
    if (!pks || pks === '') {
      return h.response().code(400).takeover()
    }

    logTime = timingLog('/events route mid 2', logTime)

    const events = await getEvents(pks.split(','))

    timingLog('/events route end 3', logTime)

    return h.response({
      events
    }).code(200)
  }
}
