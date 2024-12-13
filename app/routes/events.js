const { getEvents } = require('../repos/events')

module.exports = {
  method: 'GET',
  path: '/events',
  handler: async (request, h) => {
    console.time('/events route getParams')
    const pks = request.query.pks
    if (!pks || pks === '') {
      return h.response().code(400).takeover()
    }

    console.timeEnd('/events route getParams')
    console.time('/events route getEvents main call')

    const events = await getEvents(pks.split(','))

    console.timeEnd('/events route getEvents main call')

    return h.response({
      events
    }).code(200)
  }
}
