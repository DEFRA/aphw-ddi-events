const { WARNING_EVENT } = require('../constants/event-types')
const { getParentEventType } = require('./get-event-type')
const { validateEventData } = require('./validate-event-data')
const { sendAlert } = require('../messaging/send-alert')
const { save } = require('./handle-event')

const processEvent = async (event) => {
  const eventType = getParentEventType(event.type)
  validateEventData(event.data, eventType)

  await save(event, eventType)
  if (eventType === WARNING_EVENT) {
    await sendAlert(event)
  }
}

module.exports = {
  processEvent
}
