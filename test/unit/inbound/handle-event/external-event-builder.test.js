const { createLoginEntity } = require('../../../../app/inbound/handle-event/external-event-builder')
describe('external-event-builder', () => {
  describe('createLoginEntity', () => {
    test('should create a login entity', () => {
      const event = {
        partitionKey: 'login',
        time: 1728916381110,
        type: 'uk.gov.defra.ddi.event.external.login',
        data: {
          message: JSON.stringify({
            actioningUser: { username: 'john@email.com' },
            details: {
              username: 'robocop@detroit.police.gov',
              userAgent: 'Robo-Client'
            }
          })
        }
      }

      const entity = createLoginEntity(event)
      expect(entity).toEqual({
        ...event,
        partitionKey: 'login',
        rowKey: expect.anything(),
        category: 'event.external',
        data: event.data ? JSON.stringify(event.data) : undefined
      })
    })
  })
})
