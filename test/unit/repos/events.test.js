const { eventsAsyncIterator: mockEventsIterator } = require('../../mocks/events')

describe('Events repo', () => {
  const { getEvents, constructQueryText, changeUsernameToPseudonym } = require('../../../app/repos/events')

  const { getClient } = require('../../../app/storage')
  jest.mock('../../../app/storage')

  const { getPseudonymsAsMap } = require('../../../app/repos/pseudonyms')
  jest.mock('../../../app/repos/pseudonyms')

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
    getPseudonymsAsMap.mockResolvedValue(new Map())

    const events = await getEvents(['ED1'])

    expect(events).toHaveLength(4)
  })

  test('getEvents should throw if error', async () => {
    getClient.mockReturnValue()

    await expect(getEvents(['ED1'])).rejects.toThrow('Cannot read properties of undefined (reading \'listEntities\')')
  })

  test('constructQueryText should handle single PK', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const query = constructQueryText(['ED1'])

    expect(query).toBe('PartitionKey eq \'ED1\'')
  })

  test('constructQueryText should handle multipel PKs', async () => {
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn().mockReturnValue(mockEventsIterator) })

    const query = constructQueryText(['ED1', 'ED2', 'ED3'])

    expect(query).toBe('PartitionKey eq \'ED1\' or PartitionKey eq \'ED2\' or PartitionKey eq \'ED3\'')
  })

  describe('changeUsernameToPseudonym', () => {
    const pseudonymMap = new Map([
      ['internal-user', 'Hal'],
      ['martin-smith', 'Joe'],
      ['jane-doe', 'John'],
      ['phil-jones', 'Martin']
    ])

    test('should change username to Pseudonym given one exists', () => {
      expect(changeUsernameToPseudonym('internal-user', pseudonymMap)).toEqual('Hal')
    })

    test('should change username to Pseudonym given one exists', () => {
      expect(changeUsernameToPseudonym('someone', pseudonymMap)).toEqual('Index user')
    })
  })
})
