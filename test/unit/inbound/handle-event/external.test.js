const { EXTERNAL_EVENT } = require('../../../../app/constants/event-types')

describe('external', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  jest.mock('../../../../app/storage')
  const { getClient } = require('../../../../app/storage')

  jest.mock('../../../../app/inbound/handle-event/create-if-not-exists')
  const { createIfNotExists } = require('../../../../app/inbound/handle-event/create-if-not-exists')

  const { saveExternalEvent } = require('../../../../app/inbound/handle-event/external-event')

  describe('saveExternalEvent', () => {
    test('should save an external event with partitionKey', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'key',
        id: 'id',
        time: 1728916381110,
        data: {
          property: true
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists).toHaveBeenCalledWith(clientMock, {
        partitionKey: 'key',
        id: 'id',
        rowKey: 'id|1728916381110',
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        data: '{"property":true}'
      })
    })

    test('should save an external event without partitionKey', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        id: 'id',
        time: 1728916381110,
        data: {
          property: true
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists).toHaveBeenCalledWith(clientMock, {
        partitionKey: 'id',
        id: 'id',
        rowKey: 'id|1728916381110',
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        data: '{"property":true}'
      })
    })
  })
})
