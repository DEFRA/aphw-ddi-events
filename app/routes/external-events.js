const { getExternalEvents } = require('../repos/external-events')
const { externalEventsQuerySchema, externalEventsResponseSchema } = require('../schemas/external-events')

module.exports = {
  method: 'GET',
  path: '/external-events',
  options: {
    validate: {
      query: externalEventsQuerySchema,
      failAction: (request, h, err) => {
        console.error(err)

        return h.response({ errors: err.details.map(e => e.message) }).code(400).takeover()
      }
    },
    response: {
      schema: externalEventsResponseSchema,
      failAction: (request, h, err) => {
        console.error(err)

        return h.response({ errors: err.details.map(e => e.message) }).code(400).takeover()
      }
    },
    handler: async (request, h) => {
      console.log('JB1 handler')
      const {
        queryType,
        fromDate,
        toDate,
        pks
      } = request.query

      console.log('JB1 queryType', queryType)
      console.log('JB1 pks', pks)
      console.log('JB1 fromDate', fromDate)
      console.log('JB1 toDate', toDate)
      const results = await getExternalEvents(queryType, pks, fromDate, toDate)

      console.log('results', results)
      return h.response({
        results
      }).code(200)
    }
  }
}
