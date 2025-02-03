const { getWarningType } = require('../../../../app/inbound/handle-event/get-warning-type')

describe('get warning type', () => {
  test('should handle warning type', () => {
    expect(getWarningType('abc.warning.def.ghi')).toBe('def.ghi')
  })
})
