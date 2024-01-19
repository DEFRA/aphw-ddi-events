jest.mock('ffc-messaging')
const { MessageReceiver } = require('ffc-messaging')

const { start, stop } = require('../../../app/messaging')

describe('inbound messaging', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('start should create receiver', async () => {
    await start()

    expect(MessageReceiver).toHaveBeenCalledTimes(1)
  })

  test('start should subscribe to import queue', async () => {
    const subscribeSpy = jest.spyOn(MessageReceiver.prototype, 'subscribe')

    await start()

    expect(subscribeSpy).toHaveBeenCalledTimes(1)
  })

  test('stop should close receiver', async () => {
    const closeSpy = jest.spyOn(MessageReceiver.prototype, 'closeConnection')

    await stop()

    expect(closeSpy).toHaveBeenCalledTimes(1)
  })
})
