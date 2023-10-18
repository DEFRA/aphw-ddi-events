const util = require('util')
const { VALIDATION } = require('../constants/errors')
const { processEvent } = require('../inbound')
const { validateEvent } = require('./validate-event')

const processEventMessage = async (message, receiver) => {
  try {
    const event = message.body
    console.log('Event received:', util.inspect(event, false, null, true))
    validateEvent(event)
    await processEvent(event)
    await receiver.completeMessage(message)
  } catch (err) {
    console.error('Unable to process event:', err)
    if (err.category === VALIDATION) {
      await receiver.deadLetterMessage(message)
    }
  }
}

module.exports = {
  processEventMessage
}
