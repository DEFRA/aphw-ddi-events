jest.mock('../../../app/inbound/handle-event/handle-event')
const { handleEvent } = require('../../../app/inbound/handle-event/handle-event')
const { processEvent } = require('../../../app/inbound')

describe('process event', () => {
  test('should process a permanently deleted event', async () => {
    const expectedEventType = 'event.delete.permanent'
    const event = {
      partitionKey: 'ED300038',
      type: 'uk.gov.defra.ddi.event.delete.permanent',
      message: '{"actioningUser":{"username":"overnight-job-system-user","displayname":"Overnight Job System User"},"operation":"permanently deleted dog","deleted":{"indexNumber":"ED300038"}}'
    }

    await processEvent(event)

    expect(handleEvent).toHaveBeenCalledWith(event, expectedEventType)
  })
})
