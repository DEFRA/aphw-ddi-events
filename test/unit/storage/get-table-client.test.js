const { EVENT, COMMENT_EVENT, WARNING_EVENT, EXTERNAL_EVENT } = require('../../../app/constants/event-types')

describe('storage', () => {
  const DEFAULT_ENV = process.env

  let tableClient
  let defaultAzureCredential

  beforeEach(() => {
    jest.resetModules()

    jest.mock('@azure/data-tables')
    jest.mock('@azure/identity')

    tableClient = require('@azure/data-tables').TableClient
    defaultAzureCredential = require('@azure/identity').DefaultAzureCredential
    tableClient.fromConnectionString.mockReturnValue({ createTable: jest.fn() })

    process.env = { ...DEFAULT_ENV }
  })

  afterAll(() => {
    process.env = DEFAULT_ENV
  })

  test('should use connection string if useConnectionString true', async () => {
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'true'

    const { initialiseTables } = require('../../../app/storage')
    await initialiseTables()

    expect(tableClient.fromConnectionString).toHaveBeenCalledTimes(5)
  })

  test('should use DefaultAzureCredential if useConnectionString false', async () => {
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'false'

    const { initialiseTables } = require('../../../app/storage')
    await initialiseTables()

    expect(tableClient).toHaveBeenCalledTimes(5)
    expect(defaultAzureCredential).toHaveBeenCalledTimes(5)
    expect(tableClient.fromConnectionString).not.toHaveBeenCalled()
  })

  test('should return correct client type', async () => {
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'false'

    const { initialiseTables, getClient, getPseudonymClient } = require('../../../app/storage')
    await initialiseTables()

    const eventClient = getClient(EVENT)
    expect(eventClient).not.toBe(null)

    const commentClient = getClient(COMMENT_EVENT)
    expect(commentClient).not.toBe(null)

    const warningClient = getClient(WARNING_EVENT)
    expect(warningClient).not.toBe(null)

    const externalEventClient = getClient(EXTERNAL_EVENT)
    expect(externalEventClient).not.toBe(null)

    const pseudonymClient = getPseudonymClient()
    expect(pseudonymClient).not.toBe(null)
  })

  test('should throw error if invalid client type', async () => {
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'false'

    const { initialiseTables, getClient } = require('../../../app/storage')
    await initialiseTables()

    try {
      getClient('invalid')
      expect.toBeTruthy()
    } catch (err) {
      expect(err.message).toBe('Unknown event type: invalid')
    }
  })
})
