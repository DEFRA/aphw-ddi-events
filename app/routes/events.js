const { getEvents } = require('../repos/events')

module.exports = {
  method: 'GET',
  path: '/events/{pk}',
  handler: async (request, h) => {
    const events = await getEvents(request.params.pk)

    return h.response({
      events
    }).code(200)
  }
}
