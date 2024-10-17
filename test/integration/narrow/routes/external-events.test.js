const { enforcementHeader, portalHeader } = require('../../../mocks/jwt')
describe('External-events endpoint', () => {
  const { externalEventsFromTable: mockEvents } = require('../../../mocks/external-events')

  const createServer = require('../../../../app/server')
  let server

  jest.mock('../../../../app/repos/external-events')
  const { getExternalEvents } = require('../../../../app/repos/external-events')

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  test('GET /external-events?queryType=dog&pks=ED1 route returns 200', async () => {
    getExternalEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/external-events?queryType=dog&pks=ED1',
      ...portalHeader
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /external-events?queryType=dog&pks=ED2 route returns events', async () => {
    getExternalEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/external-events?queryType=dog&pks=ED2',
      ...portalHeader
    }

    const response = await server.inject(options)
    const { results } = JSON.parse(response.payload)

    expect(results).toHaveLength(4)
    expect(results[0].rowKey).toBe('101')
    expect(results[1].rowKey).toBe('102')
    expect(results[2].rowKey).toBe('103')
    expect(results[3].rowKey).toBe('104')
  })

  test('GET /external-events?queryType=search&pks=john,smith,bruno route returns events when multiple pks', async () => {
    getExternalEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/external-events?queryType=search&pks=john,smith,bruno',
      ...portalHeader
    }

    const response = await server.inject(options)
    const { results } = JSON.parse(response.payload)

    expect(results).toHaveLength(4)
    expect(results[0].rowKey).toBe('101')
    expect(results[1].rowKey).toBe('102')
    expect(results[2].rowKey).toBe('103')
    expect(results[3].rowKey).toBe('104')
  })

  test('GET /external-events route returns 500 if db error', async () => {
    getExternalEvents.mockRejectedValue(new Error('Test error'))

    const options = {
      method: 'GET',
      url: '/external-events?queryType=owner&pks=P-123-456',
      ...portalHeader
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })

  test('GET /external-events route returns 400 if missing params', async () => {
    getExternalEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/external-events',
      ...portalHeader
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
  })

  test('GET /external-events route returns 401 if called from enforcement', async () => {
    getExternalEvents.mockResolvedValue(mockEvents)

    const options = {
      method: 'GET',
      url: '/external-events?queryType=owner&pks=P-123-456',
      ...enforcementHeader
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(403)
  })

  test('GET /external-events route returns 400 if missing values in response', async () => {
    const badResponse = {}
    getExternalEvents.mockResolvedValue(badResponse)

    const options = {
      method: 'GET',
      url: '/external-events?queryType=dog&pks=ED1',
      ...portalHeader
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(400)
  })

  afterEach(async () => {
    await server.stop()
  })
})
