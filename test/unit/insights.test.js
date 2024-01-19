describe('Application Insights', () => {
  const DEFAULT_ENV = process.env
  let applicationInsights

  beforeEach(() => {
    jest.resetModules()
    jest.mock('applicationinsights', () => ({
      setup: jest.fn().mockReturnThis(),
      setAutoCollectDependencies: jest.fn().mockReturnThis(),
      start: jest.fn(),
      defaultClient: {
        context: {
          keys: [],
          tags: []
        }
      }
    }))
    applicationInsights = require('applicationinsights')
    process.env = { ...DEFAULT_ENV }
  })

  afterAll(() => {
    process.env = DEFAULT_ENV
  })

  test('should not setup application insights if no instrumentation key', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = undefined
    const appInsights = require('../../app/insights')
    appInsights.setup()
    expect(applicationInsights.setup.mock.calls.length).toBe(0)
  })

  test('should setup application insights if instrumentation key present', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-key'
    const appInsights = require('../../app/insights')
    appInsights.setup()
    expect(applicationInsights.setup.mock.calls.length).toBe(1)
  })
})
