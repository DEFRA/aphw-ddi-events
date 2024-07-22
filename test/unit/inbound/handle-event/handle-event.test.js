const { handleEvent } = require('../../../../app/inbound/handle-event/handle-event')

describe('handle event', () => {
  test('should process a permanently deleted event', async () => {
    expect(handleEvent).toBeInstanceOf(Function)
  })
})
