describe('Users endpoint', () => {
  const { users: mockUsers } = require('../../../mocks/users')

  const createServer = require('../../../../app/server')
  let server

  jest.mock('../../../../app/repos/pseudonyms')
  const { getPseudonyms } = require('../../../../app/repos/pseudonyms')

  beforeEach(async () => {
    jest.clearAllMocks()
    server = await createServer()
    await server.initialize()
  })

  test('GET /users route returns 200', async () => {
    getPseudonyms.mockResolvedValue(mockUsers)

    const options = {
      method: 'GET',
      url: '/users'
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
    expect(users[3].username).toBe('phil-jones')
    expect(users[3].pseudonym).toBe('Martin')
  })

  test('GET /events route returns 500 if db error', async () => {
    getPseudonyms.mockRejectedValue(new Error('Test error'))

    const options = {
      method: 'GET',
      url: '/users'
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(500)
  })

  afterEach(async () => {
    await server.stop()
  })
})
