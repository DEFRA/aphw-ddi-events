const { getEnvironmentVariable } = require('../../../app/lib/environment-helpers')
describe('index config', () => {
  const environmentHelperStubs = require('../../../app/lib/environment-helpers')
  const getEnvironmentVariableMock = jest.spyOn(environmentHelperStubs, 'getEnvironmentVariable')

  beforeEach(() => {
    jest.resetAllMocks() // Most important - it clears the cache
  })

  test('should fail validation if invalid', () => {
    getEnvironmentVariableMock.mockImplementation(envVar => {
      if (envVar === 'PORTAL_PUBLIC_KEY') {
        return undefined
      }
      return getEnvironmentVariable(envVar)
    })
    expect(() => require('../../../app/config/auth.js')).toThrow('The server API config is invalid. "authTokens.portalKey" is required')
  })

  test('should not fail validation if PERMITTED_DOMAINS is a JSON array with domains or emails', () => {
    getEnvironmentVariableMock.mockImplementation(envVar => {
      if (envVar === 'PERMITTED_DOMAINS') {
        return '.example.com,@example.com'
      }
      return getEnvironmentVariable(envVar)
    })
    expect(() => require('../../../app/config/auth.js')).not.toThrow()
  })
})
