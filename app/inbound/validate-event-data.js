const { VALIDATION } = require('../constants/errors')

const validateEventData = (eventData, eventType) => {
  const schema = require(`./schemas/${eventType}`)
  const validationResult = schema.validate(eventData, { abortEarly: false, allowUnknown: true })
  if (validationResult.error) {
    const error = new Error(`Event data is invalid, ${validationResult.error.message}`)
    error.category = VALIDATION
    throw error
  }
}

module.exports = {
  validateEventData
}
