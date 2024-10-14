const Joi = require('joi')

module.exports = Joi.object({
  message: Joi.string().required()
})
