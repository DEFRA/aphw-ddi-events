const { getMockPseudonymsAsyncIterator } = require('../../mocks/pseudonyms')
const {
  getPseudonyms, getPseudonymsAsMap, addUser, removeUser, findUserByUsername, addUserPreflightCheck, sortByTimestamp,
  sortByUsername
} = require('../../../app/repos/pseudonyms')

const validUser = {
  username: 'valid-user',
  displayname: 'Valid User'
}

jest.mock('../../../app/storage')
const { getClient } = require('../../../app/storage')
const { getPseudonymClient } = require('../../../app/storage')
const { DuplicateResourceError } = require('../../../app/errors/duplicateResourceError')
const { ResourceNotFoundError } = require('../../../app/errors/resourceNotFound')

describe('Pseudonyms repo', () => {
  let tableClient
  const entityClient = jest.fn()
  const listEntitiesMock = jest.fn(() => getMockPseudonymsAsyncIterator())
  const deleteEntityMock = jest.fn()

  beforeEach(() => {
    getPseudonymClient.mockReturnValue({
      createTable: jest.fn(),
      createEntity: entityClient,
      listEntities: listEntitiesMock,
      deleteEntity: deleteEntityMock
    })
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

  describe('sortBy', () => {
    const list = [
      {
        rowKey: 1,
        timestamp: '2024-04-11T08:00:43.8624424Z',
        username: 'Joey_Flatley'
      },
      {
        rowKey: 2,
        timestamp: '2024-04-11T08:01:24.8314117Z',
        username: 'Jeremy83'
      },
      {
        rowKey: 3,
        timestamp: '2024-04-11T08:01:24.8664459Z',
        username: 'Kendrick_Wuckert'
      },
      {
        rowKey: 4,
        timestamp: '2024-04-11T08:01:24.8904697Z',
        username: 'Shane63'
      }
    ]

    describe('sortByTimestamp', () => {
      test('should sort by timestamp asc', () => {
        const sorted = [...list].sort(sortByTimestamp())
        expect(sorted.map(r => r.rowKey)).toEqual([1, 2, 3, 4])
      })

      test('should sort by timestamp desc', () => {
        const sorted = [...list].sort(sortByTimestamp(false))
        expect(sorted.map(r => r.rowKey)).toEqual([4, 3, 2, 1])
      })
    })

    describe('sortByUsername', () => {
      test('should sort by username asc', () => {
        const sorted = [...list].sort(sortByUsername())
        expect(sorted.map(r => r.rowKey)).toEqual([2, 1, 3, 4])
      })

      test('should sort by username desc', () => {
        const sorted = [...list].sort(sortByUsername(false))
        expect(sorted.map(r => r.rowKey)).toEqual([4, 3, 1, 2])
      })
    })
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
          username: 'Phil-Jones',
          pseudonym: 'martin'
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
        ['phil-jones', 'martin']
      ]

      // eslint-disable-next-line no-undef
      const expectedMap = new Map(mapEntries)
      const map = await getPseudonymsAsMap()

      expect(map.get('internal-user')).toBe('Hal')
      expect(map.size).toBe(4)
      expect(map).toEqual(expectedMap)
    })

    test('getPseudonymsAsMap should throw if error', async () => {
      getPseudonymClient.mockReturnValue()

      await expect(getPseudonymsAsMap()).rejects.toThrow('Cannot read properties of undefined (reading \'listEntities\')')
    })
  })

  describe('addUser', () => {
    test('should add user', async () => {
      const createEntityMock = jest.fn(() => ({
        clientRequestId: '67524846-c07f-4300-b1c2-c08522ccff21',
        requestId: '45566956-d6fe-4499-ac39-8fdc81e7aebf',
        version: '2022-11-02',
        date: '2024-04-05T07:20:00.000Z',
        etag: "W/\"datetime'2024-04-05T07%3A20%3A00.6999361Z'\"",
        preferenceApplied: 'return-no-content',
        contentType: 'application/json;odata=minimalmetadata'
      }))

      const getEntityMock = jest.fn((_pseudonym, _rowKey) => ({
        'odata.metadata': 'http://aphw-ddi-event-store-azurite:10002/devstoreaccount1/$metadata#pseudonyms/@Element',
        etag: 'W/"datetime\'2024-04-05T07%3A26%3A47.1373605Z\'"',
        partitionKey: 'pseudonym',
        rowKey: '11a24722-2766-4dd7-ac5c-ec0d44602170',
        data: '{"username":"Cassie.Bartell71","pseudonym":"Rod"}',
        timestamp: '2024-04-05T07:26:47.1373605Z'
      }))
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: listEntitiesMock,
        createEntity: createEntityMock,
        getEntity: getEntityMock
      })
      const user = await addUser({
        username: 'Cassie.Bartell71',
        pseudonym: 'Rod'
      }, validUser)
      expect(createEntityMock).toBeCalledWith({
        partitionKey: 'pseudonym',
        rowKey: expect.any(String),
        data: '{"username":"Cassie.Bartell71","pseudonym":"Rod"}'
      })
      expect(getEntityMock).toBeCalledWith('pseudonym', expect.any(String))
      expect(user).toEqual({
        rowKey: expect.any(String),
        username: 'Cassie.Bartell71',
        pseudonym: 'Rod'
      })
    })

    test('should throw a DuplicateResourceError given username already exists', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUser({
        username: 'jane-doe',
        pseudonym: 'John2'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with username jane-doe.'))
    })
  })

  describe('addUserPreflightCheck', () => {
    test('should succeed if user does not exist', async () => {
      const createEntityMock = jest.fn(() => ({
        clientRequestId: '67524846-c07f-4300-b1c2-c08522ccff21',
        requestId: '45566956-d6fe-4499-ac39-8fdc81e7aebf',
        version: '2022-11-02',
        date: '2024-04-05T07:20:00.000Z',
        etag: "W/\"datetime'2024-04-05T07%3A20%3A00.6999361Z'\"",
        preferenceApplied: 'return-no-content',
        contentType: 'application/json;odata=minimalmetadata'
      }))

      const getEntityMock = jest.fn((_pseudonym, _rowKey) => ({
        'odata.metadata': 'http://aphw-ddi-event-store-azurite:10002/devstoreaccount1/$metadata#pseudonyms/@Element',
        etag: 'W/"datetime\'2024-04-05T07%3A26%3A47.1373605Z\'"',
        partitionKey: 'pseudonym',
        rowKey: '11a24722-2766-4dd7-ac5c-ec0d44602170',
        data: '{"username":"Cassie.Bartell71","pseudonym":"Rod"}',
        timestamp: '2024-04-05T07:26:47.1373605Z'
      }))
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator()),
        createEntity: createEntityMock,
        getEntity: getEntityMock
      })

      await addUserPreflightCheck({
        username: 'Cassie.Bartell71',
        pseudonym: 'Rod'
      })
      expect(createEntityMock).not.toHaveBeenCalled()
    })

    test('should throw a DuplicateResourceError given username already exists', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'jane-doe',
        pseudonym: 'John2'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with username jane-doe.'))
    })

    test('should throw a DuplicateResourceError given username already exists but in different case 1', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'phil-jones',
        pseudonym: 'Martin2'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with username Phil-Jones.'))
    })

    test('should throw a DuplicateResourceError given username already exists but in different case 2', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'Jane-Doe',
        pseudonym: 'Jane'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with username jane-doe.'))
    })

    test('should throw a DuplicateResourceError given pseudonym already exists', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'jane-doe-2',
        pseudonym: 'John'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with pseudonym John.'))
    })

    test('should throw a DuplicateResourceError given pseudonym already exists but in different case', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'jane-doe-2',
        pseudonym: 'joe'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with pseudonym Joe.'))
    })

    test('should throw a DuplicateResourceError given pseudonym already exists but in different case2', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'jane-doe-2',
        pseudonym: 'martin'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with pseudonym martin.'))
    })

    test('should throw a DuplicateResourceError with details given both username and pseudonym already exists', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'jane-doe',
        pseudonym: 'John'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with username jane-doe. Resource already found with pseudonym John.'))
    })

    test('should throw a DuplicateResourceError with details given both username and pseudonym already exists but in diff users', async () => {
      getPseudonymClient.mockReturnValue({
        createTable: jest.fn(),
        listEntities: jest.fn().mockReturnValue(getMockPseudonymsAsyncIterator())
      })

      await expect(addUserPreflightCheck({
        username: 'jane-doe',
        pseudonym: 'Joe'
      })).rejects.toThrow(new DuplicateResourceError('Resource already found with pseudonym Joe. Resource already found with username jane-doe.'))
    })
  })

  describe('findUserByUsername', () => {
    test('should find a user given user exists', async () => {
      const user = await findUserByUsername('jane-doe')
      expect(user).toEqual({
        rowKey: '102',
        username: 'jane-doe',
        pseudonym: 'John'
      })
    })
    test('should return undefined given user does not exist', async () => {
      const user = await findUserByUsername('jane-doe-2')
      expect(user).toEqual(undefined)
    })
  })

  describe('removeUser', () => {
    test('should remove user', async () => {
      await removeUser('jane-doe', validUser)
      expect(deleteEntityMock).toBeCalledWith('pseudonym', '102')
    })
    test('should return a DuplicateResourceError given user does not exist', async () => {
      await expect(removeUser('Cassie.Bartell71', validUser)).rejects.toThrow(ResourceNotFoundError)
    })
  })
})
