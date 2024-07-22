const { WARNING_IDENTIFIER } = require('../../constants/warning-identifier')

const getWarningType = (eventType) => {
  return eventType.split(WARNING_IDENTIFIER)[1]
}

module.exports = {
  getWarningType
}
