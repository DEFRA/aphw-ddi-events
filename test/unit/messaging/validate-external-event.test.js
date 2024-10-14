const { validateEvent } = require('../../../app/messaging/validate-event')
const { eventsForRouteTests } = require('../../mocks/events')

const escapedJSON = jsonObj => {
  return `"${JSON.stringify(jsonObj).replaceAll('"', '\\"')}"`
}

describe('validate-external-event', () => {
  test('should validate without error', () => {
    const event = {
      id: '369ec964-b9b4-4592-abbb-ff4648a88547',
      time: '2024-02-14T09:55:28.8857932Z',
      partitionKey: 'key1',
      specversion: '1.0',
      type: 'uk.gov.defra.ddi.external.view.owner',
      source: 'aphw-ddi-portal',
      subject: 'Police Officer viewed owner record',
      data: '{ "message": ' + escapedJSON({
        operation: 'view',
        ownerId: 'P-BBDC-8579',
        activityDate: '2024-02-13T00:00:00.000Z',
        activityLabel: 'View Owner',
        actioningUser: {
          username: 'user@example.com',
          displayname: 'Example User'
        }
      }) + '}'
    }

    expect(() => validateEvent(event)).not.toThrow()
  })

  test('should throw validation error', () => {
    const event = {}
    expect(() => validateEvent(event)).toThrow('Event is invalid, "specversion" is required. "type" is required. "source" is required. "id" is required. "time" is required')
  })

  test('should validate standard events ', () => {
    eventsForRouteTests.forEach(event => {
      expect(() => validateEvent(event)).not.toThrow()
    })
  })
})
