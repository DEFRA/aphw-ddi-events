const config = require('../../app/config')

const eventMessageHelper = require('../event-message-helper')

describe('Pact Verification', () => {
  const { Verifier } = require('@pact-foundation/pact')

  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../app/server')
    await eventMessageHelper.intialiseTableStorage()
    await eventMessageHelper.truncateTables()
    await eventMessageHelper.createCdos()
    await eventMessageHelper.addAllActivities()
    await eventMessageHelper.addAllUpdates()
    await eventMessageHelper.logAllRows()
  })

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  test('validates the expectations of aphw-ddi-events', async () => {
    const opts = {
      providerBaseUrl: `http://localhost:${config.apiConfig.port}`,
      provider: 'aphw-ddi-events',
      consumerVersionTags: ['main', 'dev', 'test', 'preprod', 'prod'],
      pactBrokerUrl: process.env.PACT_BROKER_URL,
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME,
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD,
      stateHandlers: {
        'activity event exists': async () => true,
        'updated dog exists': async () => true,
        'updated dog exists with null values': async () => true,
        'updated person exists': async () => true,
        'updated person exists with null values': async () => true,
        'v1 created dog and owner exists with array of dogs': async () => true,
        'v2 created dog and owner exists with single dog': async () => true,
        'v3 created dog with created_at': async () => true
      }
    }

    await new Verifier(opts).verifyProvider()
  })

  afterEach(async () => {
    await server.stop()
  })

  afterAll(async () => {
  })
})
