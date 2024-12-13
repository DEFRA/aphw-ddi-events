const { getEvents } = require('../repos/events')

module.exports = {
  method: 'GET',
  path: '/events',
  handler: async (request, h) => {
    console.time('/events route start 1')
    const pks = request.query.pks
    if (!pks || pks === '') {
      return h.response().code(400).takeover()
    }

    console.timeEnd('/events route start 1')
    console.time('/events route mid 2')

    const events = await getEvents(pks.split(','))

    console.timeEnd('/events route mid 2')

    return h.response({
      events
    }).code(200)
  }
}
