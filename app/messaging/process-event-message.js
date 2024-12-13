const util = require('util')
const { VALIDATION } = require('../constants/errors')
const { processEvent } = require('../inbound')
const { validateEvent } = require('./validate-event')

const processEventMessage = async (message, receiver) => {
  let event
  try {
    event = message.body
    console.log('Event received:', event?.type, event?.id)
    validateEvent(event)
    await processEvent(event)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process event:', err)
    try {
      console.error('Erroring message:', util.inspect(event, false, null, true))
    } catch (_err) {
    }
    if (err.category === VALIDATION) {
      await receiver.deadLetterMessage(message)
    }
  }
}

module.exports = {
  processEventMessage
}
