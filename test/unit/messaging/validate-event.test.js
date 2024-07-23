const { validateEvent } = require('../../../app/messaging/validate-event')

const escapedJSON = jsonObj => {
  return `"${JSON.stringify(jsonObj).replaceAll('"', '\\"')}"`
}

describe('validate-event', () => {
  test('should validate without error', () => {
    const event = {
      id: '369ec964-b9b4-4592-abbb-ff4648a88547',
      time: '2024-02-14T09:55:28.8857932Z',
      partitionKey: 'key1',
      specversion: '1.0',
      type: 'uk.gov.defra.ddi.event.activity',
      source: 'aphw-ddi-portal',
      subject: 'DDI Activity Police correspondence',
      data: '{ "message": ' + escapedJSON({
        operation: 'activity',
        activity: {
          activity: '4',
          activityType: 'received',
          pk: 'ED300000',
          source: 'dog',
          activityDate: '2024-02-13T00:00:00.000Z',
          activityLabel: 'Police correspondence'
        },
        actioningUser: {
          username: 'Developer',
          displayname: 'Developer'
        }
      }) + '}'
    }

    expect(() => validateEvent(event)).not.toThrow()
  })

  test('should throw validation error', () => {
    const event = {}
    expect(() => validateEvent(event)).toThrow('Event is invalid, "specversion" is required. "type" is required. "source" is required. "id" is required. "time" is required')
  })
})
