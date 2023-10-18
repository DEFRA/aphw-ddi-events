const { WARNING_EVENT } = require('../constants/event-types')
const { getEventType } = require('./get-event-type')
const { validateEventData } = require('./validate-event-data')
const { save } = require('./save-event')
const { sendAlert } = require('../messaging/send-alert')

const processEvent = async (event) => {
  const eventType = getEventType(event.type)
  validateEventData(event.data, eventType)
  await save(event, eventType)
  if (eventType === WARNING_EVENT) {
    await sendAlert(event)
  }
}

module.exports = {
  processEvent
}
