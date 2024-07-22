const { EVENT_PREFIX, PURGE_EVENT_PREFIX, COMMENT_EVENT_PREFIX, WARNING_EVENT_PREFIX } = require('../constants/event-prefixes')
const { EVENT, COMMENT_EVENT, WARNING_EVENT, PERMANENT_DELETE_EVENT } = require('../constants/event-types')

const getParentEventType = (type) => {
  if (type.startsWith(EVENT_PREFIX)) {
    return EVENT
  } else if (type.startsWith(COMMENT_EVENT_PREFIX)) {
    return COMMENT_EVENT
  } else if (type.startsWith(WARNING_EVENT_PREFIX)) {
    return WARNING_EVENT
  } else if (type.startsWith(PERMANENT_DELETE_EVENT)) {
    return EVENT
  } else {
    throw new Error(`Unknown event type: ${type}`)
  }
}

const getEventType = (type) => {
  if (type.startsWith(PURGE_EVENT_PREFIX)) {
    return PERMANENT_DELETE_EVENT
  }
  return getParentEventType(type)
}

const getSaveEventType = (eventType) => {
  if (eventType.startsWith(PERMANENT_DELETE_EVENT)) {
    return EVENT
  }
  return eventType
}

module.exports = {
  getParentEventType,
  getEventType,
  getSaveEventType
}
