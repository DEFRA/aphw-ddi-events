const { MockEventsPagedAsyncIterator } = require('../../mocks/events')

describe('Events repo', () => {
  const { getEvents, changeUsernameToPseudonym } = require('../../../app/repos/events')

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
    getClient.mockReturnValue({ createTable: jest.fn(), listEntities: () => new MockEventsPagedAsyncIterator() })
    getPseudonymsAsMap.mockResolvedValue(new Map())

    const events = await getEvents(['ED1'])

    expect(events).toHaveLength(4)
  })

  test('getEvents should throw if error', async () => {
    getClient.mockReturnValue()

    await expect(getEvents(['ED1'])).rejects.toThrow('Cannot read properties of undefined (reading \'listEntities\')')
  })

  describe('mapEntity', () => {
    test('should not be case sensitive', () => {

    })
  })

  describe('changeUsernameToPseudonym', () => {
    const pseudonymMap = new Map([
      ['internal-user', 'Hal'],
      ['martin-smith', 'Joe'],
      ['jane-doe', 'John'],
      ['phil-jones', 'martin'],
      ['lower.case@example.com', 'Abraham']
    ])

    test('should change username to Pseudonym given one exists', () => {
      expect(changeUsernameToPseudonym('internal-user', pseudonymMap)).toEqual('Hal')
    })

    test('should change username to Pseudonym given one exists but in different case', () => {
      expect(changeUsernameToPseudonym('Lower.Case@EXAMPLE.com', pseudonymMap)).toEqual('Abraham')
    })

    test('should change username to Pseudonym given one does not exist', () => {
      expect(changeUsernameToPseudonym('someone', pseudonymMap)).toEqual('Index user')
    })

    test('should change username to Pseudonym given one does not exist', () => {
      expect(changeUsernameToPseudonym('someone', pseudonymMap)).toEqual('Index user')
    })

    test('should change username to Pseudonym given username is import-access-db', () => {
      expect(changeUsernameToPseudonym('import-access-db', pseudonymMap)).toEqual('Legacy data importer')
    })

    test('should change username to Pseudonym given username is robot-import-system-user', () => {
      expect(changeUsernameToPseudonym('robot-import-system-user', pseudonymMap)).toEqual('XLB robot importer')
    })

    test('should change username to Pseudonym given username is overnight-job-system-user', () => {
      expect(changeUsernameToPseudonym('overnight-job-system-user', pseudonymMap)).toEqual('Automated processor')
    })
  })
})
