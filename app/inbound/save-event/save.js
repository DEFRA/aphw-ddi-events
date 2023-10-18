const { EVENT, COMMENT_EVENT, WARNING_EVENT } = require('../../constants/event-types')
const { saveEvent } = require('./event')
const { saveComment } = require('./comment')
const { saveWarningEvent } = require('./warning')

const save = async (event, eventType) => {
  switch (eventType) {
    case EVENT:
      await saveEvent(event)
      break
    case COMMENT_EVENT:
      await saveComment(event)
      break
    case WARNING_EVENT:
      await saveWarningEvent(event)
      break
    default:
      throw new Error(`Unknown event type: ${eventType}`)
  }
}

module.exports = {
  save
}
