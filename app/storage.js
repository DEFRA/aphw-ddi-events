const { DefaultAzureCredential } = require('@azure/identity')
const { TableClient } = require('@azure/data-tables')
const { storageConfig } = require('./config')
const { EVENT, COMMENT_EVENT, WARNING_EVENT, PSEUDONYM } = require('./constants/event-types')

let eventClient
let commentClient
let warningClient
let pseudonymClient

const initialiseTables = async () => {
  if (storageConfig.useConnectionString) {
    console.log('Using connection string for Table Client')
    eventClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.eventTable, { allowInsecureConnection: true })
    commentClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.commentTable, { allowInsecureConnection: true })
    warningClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.warningTable, { allowInsecureConnection: true })
    pseudonymClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.pseudonymTable, { allowInsecureConnection: true })
  } else {
    console.log('Using DefaultAzureCredential for Table Client')
    eventClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.eventTable, new DefaultAzureCredential())
    commentClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.commentTable, new DefaultAzureCredential())
    warningClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.warningTable, new DefaultAzureCredential())
    pseudonymClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.pseudonymTable, new DefaultAzureCredential())
  }
  console.log('Making sure tables exist')
  await eventClient.createTable(storageConfig.eventTable)
  await commentClient.createTable(storageConfig.commentTable)
  await warningClient.createTable(storageConfig.warningTable)
  await pseudonymClient.createTable(storageConfig.pseudonymTable)
}

const getClient = (eventType) => {
  switch (eventType) {
    case EVENT:
      return eventClient
    case COMMENT_EVENT:
      return commentClient
    case WARNING_EVENT:
      return warningClient
    case PSEUDONYM:
      return pseudonymClient
    default:
      throw new Error(`Unknown event type: ${eventType}`)
  }
}

module.exports = {
  initialiseTables,
  getClient
}
