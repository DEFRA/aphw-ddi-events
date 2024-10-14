jest.mock('../../../app/inbound/handle-event/index')
const { handleEvent } = require('../../../app/inbound/handle-event/index')
const { processEvent } = require('../../../app/inbound')

jest.mock('../../../app/messaging/send-alert')
const { sendAlert } = require('../../../app/messaging/send-alert')

describe('process event', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

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

  test('should process an external event', async () => {
    const expectedEventType = 'external'
    const event = {
      id: '369ec964-b9b4-4592-abbb-ff4648a88547',
      time: '2024-02-14T09:55:28.8857932Z',
      source: 'aphw-ddi-portal',
      subject: 'Police Officer viewed owner record',
      partitionKey: 'ED300038',
      type: 'uk.gov.defra.ddi.external.view.owner',
      message: '{"operation":"view","ownerId":"P-BBDC-8579","activityDate":"2024-02-13T00:00:00.000Z","activityLabel":"View Owner","actioningUser":{"username":"user@example.com","displayname":"Example User"}}'
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

  test('should process a comment event', async () => {
    const expectedEventType = 'comment'
    const event = {
      partitionKey: 'ED300038',
      type: 'uk.gov.defra.ddi.comment.dummy',
      message: 'some message text'
    }

    await processEvent(event)

    expect(handleEvent).toHaveBeenCalledWith(event, expectedEventType)
    expect(sendAlert).not.toHaveBeenCalled()
  })
})
