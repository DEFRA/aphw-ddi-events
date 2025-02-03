describe('api config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if NODE_ENV is invalid value', () => {
    process.env.NODE_ENV = 'pre'
    expect(() => require('../../../app/config/api.js')).toThrow('')
  })

  test('should not fail validation if values are present', () => {
    process.env.SERVICE_NAME = 'ddi-service'
    expect(() => require('../../../app/config/api.js')).not.toThrow()
  })
})
