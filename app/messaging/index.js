const { messageConfig } = require('../config')
const { processEventMessage } = require('./process-event-message')
const { MessageReceiver } = require('ffc-messaging')
let receiver

const start = async () => {
  const action = message => processEventMessage(message, receiver)
  receiver = new MessageReceiver(messageConfig.eventsSubscription, action)
  await receiver.subscribe()

  console.info('Ready to process events')
}

const stop = async () => {
  await receiver.closeConnection()
}

module.exports = { start, stop }
