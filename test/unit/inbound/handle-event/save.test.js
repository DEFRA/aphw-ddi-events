const { EVENT, COMMENT_EVENT, WARNING_EVENT, PERMANENT_DELETE_EVENT, EXTERNAL_EVENT } = require('../../../../app/constants/event-types')
const { save } = require('../../../../app/inbound/handle-event/save')

jest.mock('../../../../app/inbound/handle-event/event')
const { saveEvent } = require('../../../../app/inbound/handle-event/event')

jest.mock('../../../../app/inbound/handle-event/comment')
const { saveComment } = require('../../../../app/inbound/handle-event/comment')

jest.mock('../../../../app/inbound/handle-event/warning')
const { saveWarningEvent } = require('../../../../app/inbound/handle-event/warning')

jest.mock('../../../../app/inbound/handle-event/external-event')
const { saveExternalEvent } = require('../../../../app/inbound/handle-event/external-event')

const dummyEvent = {
  eventData: { id: 123 }
}

describe('save', () => {
  afterEach(async () => {
    jest.clearAllMocks()
  })

  test('should handle EVENT event-type', async () => {
    await save(dummyEvent, EVENT)
    expect(saveEvent).toHaveBeenCalledWith(dummyEvent)
    expect(saveComment).not.toHaveBeenCalled()
    expect(saveWarningEvent).not.toHaveBeenCalled()
    expect(saveExternalEvent).not.toHaveBeenCalled()
  })

  test('should not handle PERMANENT-DELETE-EVENT event-type', async () => {
    await expect(save(dummyEvent, PERMANENT_DELETE_EVENT)).rejects.toThrow()
  })

  test('should handle COMMENT event-type', async () => {
    await save(dummyEvent, COMMENT_EVENT)
    expect(saveEvent).not.toHaveBeenCalled()
    expect(saveExternalEvent).not.toHaveBeenCalled()
    expect(saveComment).toHaveBeenCalledWith(dummyEvent)
    expect(saveWarningEvent).not.toHaveBeenCalled()
  })

  test('should handle WARNING event-type', async () => {
    await save(dummyEvent, WARNING_EVENT)
    expect(saveEvent).not.toHaveBeenCalled()
    expect(saveComment).not.toHaveBeenCalled()
    expect(saveExternalEvent).not.toHaveBeenCalled()
    expect(saveWarningEvent).toHaveBeenCalledWith(dummyEvent)
  })

  test('should handle EXTERNAL event-type', async () => {
    await save(dummyEvent, EXTERNAL_EVENT)
    expect(saveEvent).not.toHaveBeenCalled()
    expect(saveComment).not.toHaveBeenCalled()
    expect(saveWarningEvent).not.toHaveBeenCalled()
    expect(saveExternalEvent).toHaveBeenCalledWith(dummyEvent)
  })

  test('should throw if invalid event-type', async () => {
    await expect(save(dummyEvent, 'invalid')).rejects.toThrow('Unknown event type: invalid')
  })
})
