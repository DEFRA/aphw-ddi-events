const { save } = require('./save')
const eventTypes = require('../../constants/event-types')
const { purgeEventRecords } = require('./purge-event-records')
const { getSaveEventType } = require('../get-event-type')

const handleEvent = async (event, eventType) => {
  if (eventType === eventTypes.PERMANENT_DELETE_EVENT) {
    await purgeEventRecords(event)
  }
  await save(event, getSaveEventType(eventType))
}

module.exports = {
  handleEvent
}
