const { ResourceNotFoundError } = require('../../../../app/errors/resourceNotFound')
const { DuplicateResourceError } = require('../../../../app/errors/duplicateResourceError')
const { enforcementHeader, portalHeader, portalStandardHeader } = require('../../../mocks/jwt')

const validUser = {
  username: 'valid-user',
  displayname: 'Valid User'
}

describe('Users endpoint', () => {
  const { users: mockUsers } = require('../../../mocks/users')

  const createServer = require('../../../../app/server')
  let server

  jest.mock('../../../../app/auth/get-user')
  const { getCallingUser } = require('../../../../app/auth/get-user')

  jest.mock('../../../../app/repos/pseudonyms')
  const { getPseudonyms, addUser, removeUser } = require('../../../../app/repos/pseudonyms')

  beforeEach(async () => {
    jest.clearAllMocks()
    getCallingUser.mockReturnValue(validUser)
    server = await createServer()
    await server.initialize()
  })

  describe('GET /users', () => {
    test('GET /users route returns 200', async () => {
      getPseudonyms.mockResolvedValue(mockUsers)

      const options = {
        method: 'GET',
        url: '/users',
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { users } = JSON.parse(response.payload)

      expect(users).toHaveLength(4)
      expect(users[0].username).toBe('internal-user')
      expect(users[0].pseudonym).toBe('Hal')
      expect(users[1].username).toBe('martin-smith')
      expect(users[1].pseudonym).toBe('Joe')
      expect(users[2].username).toBe('jane-doe')
      expect(users[2].pseudonym).toBe('John')
      expect(users[3].username).toBe('Phil-Jones')
      expect(users[3].pseudonym).toBe('martin')
    })

    test('GET /users route returns 500 if db error', async () => {
      getPseudonyms.mockRejectedValue(new Error('Test error'))

      const options = {
        method: 'GET',
        url: '/users',
        ...portalHeader
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })

    test('GET /users route returns 403 if called from enforcement', async () => {
      getPseudonyms.mockResolvedValue(mockUsers)

      const options = {
        method: 'GET',
        url: '/users',
        ...enforcementHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })
  })

  describe('POST /users', () => {
    test('POST /users route returns 200', async () => {
      const returnedUser = {
        username: 'internal-system',
        pseudonym: 'Hal 3000',
        rowKey: '27a30cbf-8cba-4793-b499-a63d19828c13'
      }
      addUser.mockResolvedValue(returnedUser)

      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'internal-system',
          pseudonym: 'Hal 3000'
        },
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(addUser).toBeCalledWith({
        username: 'internal-system',
        pseudonym: 'Hal 3000'
      }, validUser)

      const user = JSON.parse(response.payload)

      expect(user).toEqual(returnedUser)
    })

    test('POST /users route returns 409 given username already exists', async () => {
      addUser.mockRejectedValue(new DuplicateResourceError('Resource already found with username internal-system.'))

      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'internal-system',
          pseudonym: 'Hal 3000'
        },
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(409)
      expect(JSON.parse(response.payload)).toEqual({
        statusCode: 409,
        error: 'Resource already found with username internal-system.',
        message: 'Resource already found with username internal-system.'
      })
    })

    test('POST /users route returns 409 given pseudonym already exists', async () => {
      addUser.mockRejectedValue(new DuplicateResourceError('Resource already found with pseudonym Hal 3000.'))

      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'internal-system',
          pseudonym: 'Hal 3000'
        },
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(409)
      expect(JSON.parse(response.payload)).toEqual({
        statusCode: 409,
        error: 'Resource already found with pseudonym Hal 3000.',
        message: 'Resource already found with pseudonym Hal 3000.'
      })
    })

    test('POST /users route returns 409 given username and pseudonym both already exist', async () => {
      addUser.mockRejectedValue(new DuplicateResourceError('Resource already found with pseudonym John. Resource already found with username john.adams.'))

      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'john.adams',
          pseudonym: 'John'
        },
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(409)
      expect(JSON.parse(response.payload)).toEqual({
        statusCode: 409,
        error: 'Resource already found with pseudonym John. Resource already found with username john.adams.',
        message: 'Resource already found with pseudonym John. Resource already found with username john.adams.'
      })
    })

    test('POST /users route returns 500 given server error', async () => {
      addUser.mockRejectedValue(new Error('some error'))

      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'internal-system',
          pseudonym: 'Hal 3000'
        },
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })

    test('POST /users route returns 403 given call from enforcement', async () => {
      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          pseudonym: 'Hal 3000'
        },
        ...enforcementHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })

    test('POST /users route returns 403 given call by standard user', async () => {
      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          pseudonym: 'Hal 3000'
        },
        ...portalStandardHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })

    test('POST /users route returns 400 given no username exists', async () => {
      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          pseudonym: 'Hal 3000'
        },
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('POST /users route returns 400 given no pseudonym exists', async () => {
      const options = {
        method: 'POST',
        url: '/users',
        payload: {
          username: 'internal-system'
        },
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('DELETE /users', () => {
    test('DELETE /users returns a 204', async () => {
      const options = {
        method: 'DELETE',
        url: '/users/Cassie.Bartell71',
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(204)
      expect(response.payload).toBe('')
      expect(removeUser).toBeCalledWith('Cassie.Bartell71', validUser)
    })

    test('DELETE /users returns a 404 given username does not exist', async () => {
      removeUser.mockRejectedValue(new ResourceNotFoundError('Username not found'))
      const options = {
        method: 'DELETE',
        url: '/users/Cassie.Bartell71',
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
      expect(removeUser).toBeCalledWith('Cassie.Bartell71', validUser)
      expect(response.payload).toBe('Username not found')
    })

    test('DELETE /users returns a 500 given server error is thrown', async () => {
      removeUser.mockRejectedValue(new Error('Server errro'))
      const options = {
        method: 'DELETE',
        url: '/users/Cassie.Bartell71',
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
      expect(removeUser).toBeCalledWith('Cassie.Bartell71', validUser)
    })

    test('DELETE /users returns a 404 given username is missing', async () => {
      const options = {
        method: 'DELETE',
        url: '/users',
        ...portalHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
      expect(removeUser).not.toHaveBeenCalled()
    })

    test('DELETE /users returns a 403 given enforcement call', async () => {
      const options = {
        method: 'DELETE',
        url: '/users/Cassie.Bartell71',
        ...enforcementHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })

    test('DELETE /users returns a 403 given standard call', async () => {
      const options = {
        method: 'DELETE',
        url: '/users/Cassie.Bartell71',
        ...portalStandardHeader
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(403)
    })
  })

  afterEach(async () => {
    await server.stop()
  })
})
