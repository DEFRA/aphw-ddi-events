const { ALERT } = require('../constants/message-types')
const { SOURCE } = require('../constants/source')

const createMessage = (body) => {
  return {
    body,
    type: ALERT,
    source: SOURCE
  }
}

module.exports = {
  createMessage
}
