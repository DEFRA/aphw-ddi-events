const { timingLog } = require('../../../app/lib/log-helper')

describe('Log helper', () => {
  test('timingLog should add start time if not supplied', async () => {
    const startTime = new Date()
    const res = timingLog('Test message')
    expect(res.getTime() - startTime.getTime()).toBeLessThan(100)
  })

  test('timingLog should use start time if supplied', async () => {
    const now = new Date()
    const startTime = new Date(now.getTime() - 1000)
    const res = timingLog('Test message', startTime)
    expect(res.getTime() - startTime.getTime()).toBeGreaterThan(999)
  })
})
