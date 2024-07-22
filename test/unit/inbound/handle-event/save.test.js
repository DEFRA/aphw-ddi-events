const { EVENT, COMMENT_EVENT, WARNING_EVENT } = require('../../../../app/constants/event-types')
const { save } = require('../../../../app/inbound/handle-event/save')

jest.mock('../../../../app/inbound/handle-event/event')
const { saveEvent } = require('../../../../app/inbound/handle-event/event')

jest.mock('../../../../app/inbound/handle-event/comment')
const { saveComment } = require('../../../../app/inbound/handle-event/comment')

jest.mock('../../../../app/inbound/handle-event/warning')
const { saveWarningEvent } = require('../../../../app/inbound/handle-event/warning')

const dummyEvent = {
  eventData: { id: 123 }
}

describe('save', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
  })

  test('should handle EVENT event-type', async () => {
    await save(dummyEvent, EVENT)
    expect(saveEvent).toHaveBeenCalledWith(dummyEvent)
    expect(saveComment).not.toHaveBeenCalled()
    expect(saveWarningEvent).not.toHaveBeenCalled()
  })

  test('should handle COMMENT event-type', async () => {
    await save(dummyEvent, COMMENT_EVENT)
    expect(saveEvent).not.toHaveBeenCalled()
    expect(saveComment).toHaveBeenCalledWith(dummyEvent)
    expect(saveWarningEvent).not.toHaveBeenCalled()
  })

  test('should handle WARNING event-type', async () => {
    await save(dummyEvent, WARNING_EVENT)
    expect(saveEvent).not.toHaveBeenCalled()
    expect(saveComment).not.toHaveBeenCalled()
    expect(saveWarningEvent).toHaveBeenCalledWith(dummyEvent)
  })

  test('should throw if invalid event-type', async () => {
    await expect(save(dummyEvent, 'invalid')).rejects.toThrow('Unknown event type: invalid')
  })
})
