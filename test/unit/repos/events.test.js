const { eventsAsyncIterator: mockEventsIterator } = require('../../mocks/events')

describe('Events repo', () => {
  const { getEvents } = require('../../../app/repos/events')

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

  test('getEvents should return events', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const events = await getEvents(['ED1'])

    expect(events).toHaveLength(4)
  })
})
