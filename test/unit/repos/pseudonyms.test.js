const { pseudonymsAsyncIterator: mockPseudonymsAsyncIterator } = require('../../mocks/pseudonyms')

describe('Pseudonyms repo', () => {
  const { getPseudonymsAsMap } = require('../../../app/repos/pseudonyms')

  const { getPseudonymClient } = require('../../../app/storage')
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

  test('getPseudonyms should return events', async () => {
    getPseudonymClient.mockReturnValue({
      createTable: jest.fn(),
      listEntities: jest.fn().mockReturnValue(mockPseudonymsAsyncIterator)
    })

    /**
     * @type {[string, string][]}
     */
    const mapEntries = [
      ['internal-user', 'Hal'],
      ['martin-smith', 'Joe'],
      ['jane-doe', 'John'],
      ['phil-jones', 'Martin']
    ]

    const expectedMap = new Map(mapEntries)
    const map = await getPseudonymsAsMap()

    console.log('map', map)
    expect(map.get('internal-user')).toBe('Hal')
    expect(map.size).toBe(4)
    expect(map).toEqual(expectedMap)
  })

  test('getPseudonyms should throw if error', async () => {
    getPseudonymClient.mockReturnValue()

    await expect(getPseudonymsAsMap()).rejects.toThrow('Cannot read properties of undefined (reading \'listEntities\')')
  })
})
