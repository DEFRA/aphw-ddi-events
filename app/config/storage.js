const Joi = require('joi')

const schema = Joi.object({
  useConnectionString: Joi.bool().default(false),
  connectionString: Joi.string().optional(),
  account: Joi.string().required(),
  eventTable: Joi.string().default('events'),
  commentTable: Joi.string().default('comments'),
  warningTable: Joi.string().default('warnings'),
  pseudonymTable: Joi.string().default('pseudonyms')
})

const config = {
  useConnectionString: process.env.AZURE_STORAGE_USE_CONNECTION_STRING,
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  account: process.env.AZURE_STORAGE_ACCOUNT_NAME,
  eventTable: process.env.AZURE_STORAGE_EVENT_TABLE,
  commentTable: process.env.AZURE_STORAGE_COMMENT_TABLE,
  warningTable: process.env.AZURE_STORAGE_WARNING_TABLE,
  pseudonymTable: process.env.AZURE_STORAGE_PSEUDONYM_TABLE
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
