const { odata } = require('@azure/data-tables')

const createIfNotExists = async (client, entity) => {
  const existingEvents = []
  const events = client.listEntities({ queryOptions: { filter: odata`PartitionKey eq ${entity.partitionKey} and RowKey eq ${entity.rowKey}` } })
  for await (const event of events) {
    existingEvents.push(event)
  }

  if (existingEvents.length > 0) {
    console.log('Event already exists, skipping', entity)
    return
  }

  await client.createEntity(entity)
}

module.exports = {
  createIfNotExists
}
