const Joi = require('joi')

const externalEventsQuerySchema = Joi.object({
  queryType: Joi.string().valid('search', 'date', 'dog', 'owner', 'user', 'login').required(),
  fromDate: Joi.string().optional().allow('').allow(null),
  toDate: Joi.string().optional().allow('').allow(null),
  pks: Joi.string().required()
})

const externalEventsResponseSchema = Joi.object({
  results: Joi.array().items(Joi.object({
    partitionKey: Joi.string().required(),
    rowKey: Joi.string().required(),
    username: Joi.string().required(),
    timestamp: Joi.string().required(),
    type: Joi.string().required(),
    details: Joi.object().required()
  }))
})

module.exports = {
  externalEventsQuerySchema,
  externalEventsResponseSchema
}
