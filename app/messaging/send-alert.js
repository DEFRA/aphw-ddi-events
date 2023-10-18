const { MessageSender } = require('ffc-messaging')
const { messageConfig } = require('../config')
const { createMessage } = require('./create-message')

const sendAlert = async (body) => {
  const message = createMessage(body)
  const sender = new MessageSender(messageConfig.alertTopic)
  await sender.sendMessage(message)
  await sender.closeConnection()
  console.log('Request for alert sent')
}

module.exports = {
  sendAlert
}
