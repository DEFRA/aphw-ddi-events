const { eventsAsyncIterator: mockEventsIterator } = require('../../mocks/events')

describe('ExternalEvents repo', () => {
  const { getExternalEvents } = require('../../../app/repos/external-events')

  const { getClient } = require('../../../app/storage')
  jest.mock('../../../app/storage')

  let tableClient

  beforeEach(() => {
    jest.resetModules()

    jest.mock('@azure/data-tables')

    tableClient = require('@azure/data-tables').TableClient
    tableClient.fromConnectionString.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn() })
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'true'
  })

  /*
  test('getExternalEvents should return events for viewDog', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const events = await getExternalEvents('viewDog', ['ED1'])

    expect(events).toHaveLength(4)
  })
  */
  test('getExternalEvents should return events for viewOwner', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const events = await getExternalEvents('viewOwner', ['P-123-456'])

    expect(events).toHaveLength(4)
  })

  test('getExternalEvents should return events for search', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const events = await getExternalEvents('search', ['smith'])

    expect(events).toHaveLength(4)
  })

  test('getExternalEvents should return events for user', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const events = await getExternalEvents('user', ['john@here.com'])

    expect(events).toHaveLength(4)
  })

  test('getExternalEvents should return events for date', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const events = await getExternalEvents('date', [], '2024-05-05', '2024-10-10')

    expect(events).toHaveLength(4)
  })

  test('getEvents should throw if error', async () => {
    getClient.mockReturnValue()

    await expect(getExternalEvents('viewDog', ['ED1'])).rejects.toThrow('Cannot read properties of undefined (reading \'listEntities\')')
  })
  describe('mapEntity', () => {
    test('should not be case sensitive', () => {

    })
  })
})
