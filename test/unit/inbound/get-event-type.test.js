const { EVENT, COMMENT_EVENT, WARNING_EVENT, PERMANENT_DELETE_EVENT } = require('../../../app/constants/event-types')
const { getParentEventType, getEventType } = require('../../../app/inbound/get-event-type')

describe('getEventType', () => {
  describe('getParentEventType', () => {
    test('should handle EVENT', () => {
      expect(getParentEventType('uk.gov.defra.ddi.event.abc')).toBe(EVENT)
    })

    test('should handle COMMENT', () => {
      expect(getParentEventType('uk.gov.defra.ddi.comment.abc')).toBe(COMMENT_EVENT)
    })

    test('should handle WARNING', () => {
      expect(getParentEventType('uk.gov.defra.ddi.warning.abc')).toBe(WARNING_EVENT)
    })

    test('should throw if invalid', () => {
      expect(() => getParentEventType('uk.gov.defra.ddi.invalid.abc')).toThrow('Unknown event type: uk.gov.defra.ddi.invalid.abc')
    })
  })

  describe('getEventType', () => {
    test('should handle PURGE EVENT', () => {
      expect(getEventType('uk.gov.defra.ddi.event.delete.permanent')).toBe(PERMANENT_DELETE_EVENT)
    })

    test('should handle other types', () => {
      expect(getEventType('uk.gov.defra.ddi.comment.abc')).toBe(COMMENT_EVENT)
    })
  })
})
