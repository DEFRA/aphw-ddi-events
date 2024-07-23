const { getMockForPurgingAsyncIterator, getMockForPurgingNoEventsAsyncIterator } = require('../../../mocks/events-for-purging')
const { purgeEventRecords } = require('../../../../app/inbound/handle-event/purge-event-records')

jest.mock('../../../../app/storage')
const { getClient } = require('../../../../app/storage')

describe('PurgeEventRecords', () => {
  let tableClient
  const entityClient = jest.fn()
  const listEntitiesMock = jest.fn(() => getMockForPurgingAsyncIterator())
  const deleteEntityMock = jest.fn()

  beforeEach(() => {
    getClient.mockReturnValue({
      createTable: jest.fn(),
      createEntity: entityClient,
      listEntities: listEntitiesMock,
      deleteEntity: deleteEntityMock
    })
    jest.mock('@azure/data-tables')

    tableClient = require('@azure/data-tables').TableClient
    tableClient.fromConnectionString.mockReturnValue({ createTable: jest.fn(), listEntities: jest.fn() })
    process.env.AZURE_STORAGE_USE_CONNECTION_STRING = 'true'
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('purgeEvents', () => {
    test('should purge events if same partitionKey', async () => {
      await purgeEventRecords({ partitionKey: 'ED12345' })
      expect(deleteEntityMock.mock.calls[0]).toEqual(['ED12345', '101'])
      expect(deleteEntityMock.mock.calls[1]).toEqual(['ED12345', '102'])
      expect(deleteEntityMock.mock.calls[2]).toEqual(['ED12345', '103'])
      expect(deleteEntityMock.mock.calls[3]).toEqual(['ED12345', '104'])
    })

    test('should not delete entities if no audit records exist for partition key', async () => {
      getClient.mockReturnValue({
        createTable: jest.fn(),
        createEntity: entityClient,
        listEntities: jest.fn(() => getMockForPurgingNoEventsAsyncIterator()),
        deleteEntity: deleteEntityMock
      })
      await purgeEventRecords({ partitionKey: 'ED12345' })
      expect(deleteEntityMock).not.toHaveBeenCalled()
    })
  })
})
