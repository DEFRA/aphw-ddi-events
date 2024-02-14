describe('Events endpoint', () => {
  const { eventsForRouteTests: mockEvents } = require('../../../mocks/events')

  const createServer = require('../../../../app/server')
  let server

  jest.mock('../../../../app/repos/events')
  const { getEvents } = require('../../../../app/repos/events')

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  test('GET /events/ED1 route returns 200', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events/ED1'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /events/ED1 route returns events', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events/ED1'
    }

    const response = await server.inject(options)
    const { events } = JSON.parse(response.payload)

    expect(events).toHaveLength(4)
    expect(events[0].operation).toBe('activity')
    expect(events[1].operation).toBe('updated dog')
    expect(events[2].operation).toBe('created cdo')
    expect(events[3].operation).toBe('updated person')
  })

  test('GET /events route returns 500 if db error', async () => {
    getEvents.mockRejectedValue(new Error('Test error'))

    const options = {
      method: 'GET',
      url: '/events/ED1'
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })

  afterEach(async () => {
    await server.stop()
  })
})
