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
    test('should save an external event of type view.owner', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'P-123-456',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.view.owner',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              dogIndexNumbers: ['ED12345', 'ED23456'],
              pk: 'P-123-456'
            }
          })
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists.mock.calls).toHaveLength(5)
      expect(createIfNotExists.mock.calls[0][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[0][1]).toEqual({
        partitionKey: 'user_john@email.com',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.owner',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"dogIndexNumbers\\":[\\"ED12345\\",\\"ED23456\\"],\\"pk\\":\\"P-123-456\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[1][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[1][1]).toEqual({
        partitionKey: 'owner_P-123-456',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.owner',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"dogIndexNumbers\\":[\\"ED12345\\",\\"ED23456\\"],\\"pk\\":\\"P-123-456\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[2][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[2][1]).toEqual({
        partitionKey: 'date',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.owner',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"dogIndexNumbers\\":[\\"ED12345\\",\\"ED23456\\"],\\"pk\\":\\"P-123-456\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[3][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[3][1]).toEqual({
        partitionKey: 'dog_ED12345',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED12345\\",\\"source\\":\\"view-owner-P-123-456\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[4][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[4][1]).toEqual({
        partitionKey: 'dog_ED23456',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED23456\\",\\"source\\":\\"view-owner-P-123-456\\"}}"}'
      })
    })

    test('should save an external event of type view.owner.activity', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'P-123-456',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.view.owner.activity',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              dogIndexNumbers: ['ED12345', 'ED23456'],
              pk: 'P-123-456'
            }
          })
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists.mock.calls).toHaveLength(3)
      expect(createIfNotExists.mock.calls[0][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[0][1]).toEqual({
        partitionKey: 'user_john@email.com',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.owner.activity',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"dogIndexNumbers\\":[\\"ED12345\\",\\"ED23456\\"],\\"pk\\":\\"P-123-456\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[1][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[1][1]).toEqual({
        partitionKey: 'owner_P-123-456',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.owner.activity',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"dogIndexNumbers\\":[\\"ED12345\\",\\"ED23456\\"],\\"pk\\":\\"P-123-456\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[2][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[2][1]).toEqual({
        partitionKey: 'date',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.owner.activity',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"dogIndexNumbers\\":[\\"ED12345\\",\\"ED23456\\"],\\"pk\\":\\"P-123-456\\"}}"}'
      })
    })

    test('should save an external event of type view.dog', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'ED12345',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.view.dog',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              pk: 'ED12345'
            }
          })
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists.mock.calls).toHaveLength(3)
      expect(createIfNotExists.mock.calls[0][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[0][1]).toEqual({
        partitionKey: 'user_john@email.com',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED12345\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[1][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[1][1]).toEqual({
        partitionKey: 'dog_ED12345',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED12345\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[2][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[2][1]).toEqual({
        partitionKey: 'date',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED12345\\"}}"}'
      })
    })

    test('should save an external event of type view.dog.activity', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'ED12345',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.view.dog.activity',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              pk: 'ED12345'
            }
          })
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists.mock.calls).toHaveLength(3)
      expect(createIfNotExists.mock.calls[0][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[0][1]).toEqual({
        partitionKey: 'user_john@email.com',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog.activity',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED12345\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[1][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[1][1]).toEqual({
        partitionKey: 'dog_ED12345',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog.activity',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED12345\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[2][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[2][1]).toEqual({
        partitionKey: 'date',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.view.dog.activity',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"pk\\":\\"ED12345\\"}}"}'
      })
    })

    test('should save an external event of type search - single term', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'any-guid',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              searchTerms: 'Smith'
            }
          })
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists.mock.calls).toHaveLength(3)
      expect(createIfNotExists.mock.calls[0][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[0][1]).toEqual({
        partitionKey: 'search',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"Smith\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[0][1].rowKey.startsWith('smith|')).toBeTruthy()
      expect(createIfNotExists.mock.calls[1][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[1][1]).toEqual({
        partitionKey: 'user_john@email.com',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"Smith\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[2][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[2][1]).toEqual({
        partitionKey: 'date',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"Smith\\"}}"}'
      })
    })

    test('should save an external event of type search - multiple terms', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'any-guid',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              searchTerms: 'John Smith bruno'
            }
          })
        }
      }
      await saveExternalEvent(event)

      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists.mock.calls).toHaveLength(5)
      expect(createIfNotExists.mock.calls[0][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[0][1]).toEqual({
        partitionKey: 'search',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"John Smith bruno\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[0][1].rowKey.startsWith('john|')).toBeTruthy()
      expect(createIfNotExists.mock.calls[1][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[1][1]).toEqual({
        partitionKey: 'search',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"John Smith bruno\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[1][1].rowKey.startsWith('smith|')).toBeTruthy()
      expect(createIfNotExists.mock.calls[2][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[2][1]).toEqual({
        partitionKey: 'search',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"John Smith bruno\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[2][1].rowKey.startsWith('bruno|')).toBeTruthy()
      expect(createIfNotExists.mock.calls[3][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[3][1]).toEqual({
        partitionKey: 'user_john@email.com',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"John Smith bruno\\"}}"}'
      })
      expect(createIfNotExists.mock.calls[4][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[4][1]).toEqual({
        partitionKey: 'date',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.search',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"searchTerms\\":\\"John Smith bruno\\"}}"}'
      })
    })

    test('should save an external event of type login', async () => {
      const clientMock = {
        listEntities: jest.fn()
      }
      getClient.mockResolvedValue(clientMock)

      const event = {
        partitionKey: 'login',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.login',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              username: 'robocop@detroit.police.gov',
              userAgent: 'Robo-Client'
            }
          })
        }
      }

      await saveExternalEvent(event)
      expect(getClient).toHaveBeenCalledWith(EXTERNAL_EVENT)
      expect(createIfNotExists.mock.calls).toHaveLength(1)

      expect(createIfNotExists.mock.calls[0][0]).toBe(clientMock)
      expect(createIfNotExists.mock.calls[0][1]).toEqual({
        partitionKey: 'login',
        rowKey: expect.anything(),
        time: 1728916381110,
        category: EXTERNAL_EVENT,
        type: 'uk.gov.defra.ddi.event.external.login',
        data: '{"message":"{\\"actioningUser\\":{\\"username\\":\\"john@email.com\\"},\\"details\\":{\\"username\\":\\"robocop@detroit.police.gov\\",\\"userAgent\\":\\"Robo-Client\\"}}"}'
      })
    })
  })
})
