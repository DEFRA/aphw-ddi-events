const { portalHeader, enforcementHeader } = require('../../../mocks/jwt')
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

  test('GET /events?pks=ED1 route returns 200 with call from portal', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events?pks=ED1',
      ...portalHeader
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /events?pks=ED1 route returns 200 with call from enforcement', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events?pks=ED1',
      ...enforcementHeader
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /events?pks=ED1 route returns events', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events?pks=ED1',
      ...portalHeader
    }

    const response = await server.inject(options)
    const { events } = JSON.parse(response.payload)

    expect(events).toHaveLength(4)
    expect(events[0].operation).toBe('activity')
    expect(events[1].operation).toBe('updated dog')
    expect(events[2].operation).toBe('created cdo')
    expect(events[3].operation).toBe('updated person')
  })

  test('GET /events?pks=ED1,ED2,ED3 route returns events when multiple pks', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events?pks=ED1,ED2,ED3',
      ...portalHeader
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
      url: '/events?pks=ED1',
      ...portalHeader
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })

  test('GET /events route returns 400 if missing params', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events',
      ...portalHeader
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
  })

  test('GET /events route returns 400 if missing params2', async () => {
    getEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/events?pks=',
      ...portalHeader
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
  })

  afterEach(async () => {
    await server.stop()
  })
})
