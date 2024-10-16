const Joi = require('joi')

const externalEventsQuerySchema = Joi.object({
  queryType: Joi.string().valid('search', 'date', 'viewDog', 'viewOwner', 'user').required(),
  fromDate: Joi.string().optional().allow('').allow(null),
  toDate: Joi.string().optional().allow('').allow(null),
  pks: Joi.array().items(Joi.string()).single()
})

const externalEventsResponseSchema = Joi.object({
  results: Joi.array().items(Joi.object({
    timestamp: Joi.string().required(),
    type: Joi.string().required(),
    data: Joi.string().required()
  }).unknown().required())
})

module.exports = {
  externalEventsQuerySchema,
  externalEventsResponseSchema
}
