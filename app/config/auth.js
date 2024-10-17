const Joi = require('joi')
const { getEnvironmentVariable } = require('../lib/environment-helpers')

const jsonArray = Joi.extend({
  type: 'array',
  base: Joi.array(),
  coerce: {
    from: 'string',
    method (value) {
      if (
        typeof value !== 'string' ||
        (value.startsWith('[') && !/^\s*\[/.test(value))
      ) {
        return
      }

      try {
        return { value: JSON.parse(value) }
      } catch (ignoreErr) { }
    }
  }
})

// Define config schema
const schema = Joi.object({
  authTokens: Joi.object({
    portalKey: Joi.string().required(),
    enforcementKey: Joi.string().required()
  }),
  permittedDomains: jsonArray.array().items(Joi.string().pattern(/^[a-z0-9.@]+([-.][a-z0-9]+)*\.[a-z]{2,6}$/)).default([])
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
