const { eventsForRouteTests } = require('../../mocks/events')
const { validateEvent } = require('../../../app/messaging/validate-event')

describe('validate-event-data', () => {
  test('should validate standard events ', () => {
    eventsForRouteTests.forEach(event => {
      expect(() => validateEvent(event)).not.toThrow()
    })
  })

  test('should not validate invalid events', () => {
    const invalidEventMissingType = {
      time: '2024-07-23T08:39:05.824Z',
      actioningUser: {
        username: 'dev@test.com',
        displayname: 'Developer'
      },
      source: 'aphw-ddi-portal',
      specversion: '1.0',
      operation: 'updated person',
      changes: {
        added: [],
        removed: [],
        edited: [
          [
            'address/addressLine1',
            '93 SILVERDALE AVENUE',
            '91 SILVERDALE AVENUE'
          ],
          [
            'contacts/email',
            '',
            'me@here.com'
          ]
        ]
      },
      timestamp: '2024-02-14T08:23:22.301Z',
      rowKey: '82a0507b-f2e5-4ba7-8e41-14a7ef60b972|1707899002301'
    }
    expect(() => validateEvent(invalidEventMissingType)).toThrow(new Error('Event is invalid, "type" is required. "id" is required'))
  })
})
