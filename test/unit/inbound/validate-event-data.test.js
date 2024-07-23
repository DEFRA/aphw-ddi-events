const { validateEventData } = require('../../../app/inbound/validate-event-data')

const escapedJSON = jsonObj => {
  return `"${JSON.stringify(jsonObj).replaceAll('"', '\\"')}"`
}

describe('validate-event-data', () => {
  test('should validatte event data', () => {
    const eventData = {
      message: escapedJSON({
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
      })
    }
    expect(() => validateEventData(eventData, 'event')).not.toThrow()
  })

  test('should validate event data', () => {
    const eventData = {}
    expect(() => validateEventData(eventData, 'event')).toThrow(new Error('Event data is invalid, "message" is required'))
  })
})
