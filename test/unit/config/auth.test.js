const { getEnvironmentVariable } = require('../../../app/lib/environment-helpers')
describe('index config', () => {
  const environmentHelperStubs = require('../../../app/lib/environment-helpers')
  const getEnvironmentVariableMock = jest.spyOn(environmentHelperStubs, 'getEnvironmentVariable')

  beforeEach(() => {
    jest.resetAllMocks() // Most important - it clears the cache
  })

  test('should fail if PERMITTED_DOMAINS is not a JSON array ', () => {
    getEnvironmentVariableMock.mockImplementation(envVar => {
      if (envVar === 'PERMITTED_DOMAINS') {
        return ''
      }
      return getEnvironmentVariable(envVar)
    })
    expect(() => require('../../../app/config/auth.js')).toThrow('The server API config is invalid. "permittedDomains" must be an array')
  })

  test('should fail if PERMITTED_DOMAINS has a value which is not a domain', () => {
    getEnvironmentVariableMock.mockImplementation(envVar => {
      if (envVar === 'PERMITTED_DOMAINS') {
        return '["adfdafdf"]'
      }
      return getEnvironmentVariable(envVar)
    })
    expect(() => require('../../../app/config/auth.js')).toThrow('The server API config is invalid. "permittedDomains[0]" with value "adfdafdf" fails to match the required pattern: /^[a-z0-9.@]+([-.][a-z0-9]+)*\\.[a-z]{2,6}$/')
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

  test('should not fail validation if PERMITTED_DOMAINS is a JSON array', () => {
    getEnvironmentVariableMock.mockImplementation(envVar => {
      if (envVar === 'PERMITTED_DOMAINS') {
        return '[]'
      }
      return getEnvironmentVariable(envVar)
    })
    expect(() => require('../../../app/config/auth.js')).not.toThrow()
  })

  test('should not fail validation if PERMITTED_DOMAINS is a JSON array with domains or emails', () => {
    getEnvironmentVariableMock.mockImplementation(envVar => {
      if (envVar === 'PERMITTED_DOMAINS') {
        return '[".example.com","@example.com"]'
      }
      return getEnvironmentVariable(envVar)
    })
    expect(() => require('../../../app/config/auth.js')).not.toThrow()
  })
})
