const { getMockPseudonymsAsyncIterator } = require('../../mocks/pseudonyms')
const { getPseudonyms, getPseudonymsAsMap } = require('../../../app/repos/pseudonyms')

jest.mock('../../../app/storage')
const { getPseudonymClient } = require('../../../app/storage')

describe('Pseudonyms repo', () => {
  let tableClient

  beforeEach(() => {
    getPseudonymClient.mockReturnValue({
      createTable: jest.fn(),
      listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
    })

    jest.mock('@azure/data-tables')

    tableClient = require('@azure/data-tables').TableClient
    tableClient.fromConnectionString.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn() })
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'true'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getPseudonyms', () => {
    test('should get pseudonyms', async () => {
      const pseudonyms = await getPseudonyms()

      expect(pseudonyms).toEqual([
        {
          username: 'internal-user',
          pseudonym: 'Hal',
          rowKey: '100'
        },
        {
          rowKey: '101',
          username: 'martin-smith',
          pseudonym: 'Joe'
        },
        {
          rowKey: '102',
          username: 'jane-doe',
          pseudonym: 'John'
        },
        {
          rowKey: '103',
          username: 'phil-jones',
          pseudonym: 'Martin'
        }
      ])
    })
  })

  describe('getPseudonymsAsMap', () => {
    test('getPseudonymsAsMap should return events', async () => {
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

    test('getPseudonymsAsMap should throw if error', async () => {
      getPseudonymClient.mockReturnValue()

      await expect(getPseudonymsAsMap()).rejects.toThrow('Cannot read properties of undefined (reading \'listEntities\')')
    })
  })
})
