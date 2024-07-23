jest.mock('../../../app/messaging/validate-event')
const { validateEvent } = require('../../../app/messaging/validate-event')

jest.mock('../../../app/inbound')
const { processEvent } = require('../../../app/inbound')

const { processEventMessage } = require('../../../app/messaging/process-event-message')

const receiver = {
  completeMessage: jest.fn(),
  deadLetterMessage: jest.fn()
}

const message = {
  body: {
    prop1: 123
  }
}

describe('process-event-message', () => {
  beforeEach(() => {
    validateEvent.mockReturnValue()
    processEvent.mockResolvedValue()
    jest.clearAllMocks()
  })

  test('should process without error', async () => {
    await processEventMessage(message, receiver)

    expect(processEvent).toHaveBeenCalledWith(message.body)
    expect(receiver.completeMessage).toHaveBeenCalledWith(message)
    expect(receiver.deadLetterMessage).not.toHaveBeenCalled()
  })

  test('should deadletter when validation error', async () => {
    const error = new Error('validation error')
    error.category = 'validation'
    validateEvent.mockImplementation(() => { throw error })

    await processEventMessage(message, receiver)

    expect(receiver.completeMessage).not.toHaveBeenCalled()
    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(message)
  })

  test('should not deadletter when error is not validation', async () => {
    const error = new Error('other error')
    validateEvent.mockImplementation(() => { throw error })

    await processEventMessage(message, receiver)

    expect(receiver.completeMessage).not.toHaveBeenCalled()
    expect(receiver.deadLetterMessage).not.toHaveBeenCalledWith()
  })
})
