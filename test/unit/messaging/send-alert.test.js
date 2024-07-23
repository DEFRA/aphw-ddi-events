jest.mock('ffc-messaging')
const { MessageSender } = require('ffc-messaging')

const { sendAlert } = require('../../../app/messaging/send-alert')

const body = {
  prop1: 123
}

describe('send-alert', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should process without error', async () => {
    await sendAlert(body)

    expect(MessageSender).toHaveBeenCalledTimes(1)
  })
})
