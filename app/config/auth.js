const Joi = require('joi')
const { getEnvironmentVariable } = require('../lib/environment-helpers')

// Define config schema
const schema = Joi.object({
  authTokens: Joi.object({
    portalKey: Joi.string().required(),
    enforcementKey: Joi.string().required()
  }),
  permittedDomains: Joi.string().required()
})

// Build config
const config = {
  authTokens: {
    portalKey: getEnvironmentVariable('PORTAL_PUBLIC_KEY'),
    enforcementKey: getEnvironmentVariable('ENFORCEMENT_PUBLIC_KEY')
  },
  permittedDomains: getEnvironmentVariable('PERMITTED_DOMAINS')
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

module.exports = value
