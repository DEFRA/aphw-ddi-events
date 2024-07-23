const { handleEvent } = require('../../../../app/inbound/handle-event/index')

jest.mock('../../../../app/inbound/handle-event/save')
const { save } = require('../../../../app/inbound/handle-event/save')

jest.mock('../../../../app/inbound/handle-event/purge-event-records')
const { purgeEventRecords } = require('../../../../app/inbound/handle-event/purge-event-records')

const nonPurgeEvent = {
  partitionKey: 'ED300038',
  type: 'uk.gov.defra.ddi.event.delete',
  message: '{"actioningUser":{"username":"overnight-job-system-user","displayname":"Overnight Job System User"},"operation":"deleted dog","deleted":{"indexNumber":"ED300038"}}'
}

const purgeEvent = {
  partitionKey: 'ED300038',
  type: 'uk.gov.defra.ddi.event.delete.permanent',
  message: '{"actioningUser":{"username":"overnight-job-system-user","displayname":"Overnight Job System User"},"operation":"permanently deleted dog","deleted":{"indexNumber":"ED300038"}}'
}

describe('handle event', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('should handle non-purge event', async () => {
    const eventType = 'event'
    await handleEvent(nonPurgeEvent, eventType)
    expect(save).toHaveBeenCalledWith(nonPurgeEvent, eventType)
    expect(purgeEventRecords).not.toHaveBeenCalled()
  })

  test('should handle a permanently deleted event', async () => {
    const eventType = 'event.delete.permanent'
    await handleEvent(purgeEvent, eventType)
    expect(save).toHaveBeenCalledWith(purgeEvent, 'event')
    expect(purgeEventRecords).toHaveBeenCalledWith(purgeEvent)
  })
})
