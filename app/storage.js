const { DefaultAzureCredential } = require('@azure/identity')
const { TableClient } = require('@azure/data-tables')
const { storageConfig } = require('./config')
const { EVENT, COMMENT_EVENT, WARNING_EVENT, EXTERNAL_EVENT } = require('./constants/event-types')

let eventClient
let commentClient
let warningClient
let pseudonymClient
let externalEventClient

const initialiseTables = async () => {
  if (storageConfig.useConnectionString) {
    console.log('Using connection string for Table Client')
    eventClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.eventTable, { allowInsecureConnection: true })
    externalEventClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.externalEventTable, { allowInsecureConnection: true })
    commentClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.commentTable, { allowInsecureConnection: true })
    warningClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.warningTable, { allowInsecureConnection: true })
    pseudonymClient = TableClient.fromConnectionString(storageConfig.connectionString, storageConfig.pseudonymTable, { allowInsecureConnection: true })
  } else {
    console.log('Using DefaultAzureCredential for Table Client')
    eventClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.eventTable, new DefaultAzureCredential())
    externalEventClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.externalEventTable, new DefaultAzureCredential())
    commentClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.commentTable, new DefaultAzureCredential())
    warningClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.warningTable, new DefaultAzureCredential())
    pseudonymClient = new TableClient(`https://${storageConfig.account}.table.core.windows.net`, storageConfig.pseudonymTable, new DefaultAzureCredential())
  }
  console.log('Making sure tables exist')
  await eventClient.createTable(storageConfig.eventTable)
  await commentClient.createTable(storageConfig.commentTable)
  await warningClient.createTable(storageConfig.warningTable)
  await pseudonymClient.createTable(storageConfig.pseudonymTable)
  await externalEventClient.createTable(storageConfig.externalEventTable)
}

const getClient = (eventType) => {
  switch (eventType) {
    case EVENT:
      return eventClient
    case COMMENT_EVENT:
      return commentClient
    case WARNING_EVENT:
      return warningClient
    case EXTERNAL_EVENT:
      return externalEventClient
    default:
      throw new Error(`Unknown event type: ${eventType}`)
  }
}
/**
 * @typedef {{
 *   etag: string;
 *   partitionKey: string;
 *   rowKey: string;
 *   data: string;
 *   timestamp: string;
 * }} StorageEntity
 */

/**
 *
 * @returns {{ listEntities: () => AsyncIterableIterator<StorageEntity> }}
 */
const getPseudonymClient = () => {
  return pseudonymClient
}

module.exports = {
  initialiseTables,
  getClient,
  getPseudonymClient
}
