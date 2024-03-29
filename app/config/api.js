const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  serviceName: Joi.string().default('Events'),
  port: Joi.number().default(3005),
  env: Joi.string().valid('development', 'test', 'production').default('development')
})

// Build config
const config = {
  serviceName: process.env.SERVICE_NAME,
  port: process.env.PORT,
  env: process.env.NODE_ENV
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server API config is invalid. ${result.error.message}`)
}

// Use the joi validated value
const value = result.value

value.isDev = value.env === 'development'
value.isTest = value.env === 'test'
value.isProd = value.env === 'production'

module.exports = value
