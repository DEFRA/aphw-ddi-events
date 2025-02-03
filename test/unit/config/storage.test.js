describe('storage config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('should fail validation if AZURE_STORAGE_ACCOUNT_NAME is invalid value', () => {
    process.env.AZURE_STORAGE_ACCOUNT_NAME = undefined
    expect(() => require('../../../app/config/storage.js')).toThrow('')
  })

  test('should pass validation if values are present', () => {
    process.env.AZURE_STORAGE_ACCOUNT_NAME = 'storage-account'
    expect(() => require('../../../app/config/storage.js')).not.toThrow()
  })
})
