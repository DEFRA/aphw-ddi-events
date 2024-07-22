jest.mock('../../../app/inbound/handle-event/index')
const { handleEvent } = require('../../../app/inbound/handle-event/index')
const { processEvent } = require('../../../app/inbound')

jest.mock('../../../app/messaging/send-alert')
const { sendAlert } = require('../../../app/messaging/send-alert')

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
    expect(sendAlert).not.toHaveBeenCalled()
  })

  test('should process a warning event', async () => {
    const expectedEventType = 'warning'
    const event = {
      partitionKey: 'ED300038',
      type: 'uk.gov.defra.ddi.warning.dummy',
      message: '{"actioningUser":{"username":"overnight-job-system-user","displayname":"Overnight Job System User"},"operation":"warning","deleted":{"indexNumber":"ED300038"}}'
    }

    await processEvent(event)

    expect(handleEvent).toHaveBeenCalledWith(event, expectedEventType)
    expect(sendAlert).toHaveBeenCalledWith(event)
  })
})
