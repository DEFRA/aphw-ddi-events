const { getEvents } = require('../repos/events')

module.exports = {
  method: 'GET',
  path: '/events',
  handler: async (request, h) => {
    const pks = request.query.pks
    if (!pks || pks === '') {
      return h.response().code(400).takeover()
    }

    const events = await getEvents(pks.split(','))

    return h.response({
      events
    }).code(200)
  }
}
