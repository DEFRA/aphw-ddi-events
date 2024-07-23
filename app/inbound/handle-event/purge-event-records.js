const { EVENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')

const purgeEventRecords = async (event) => {
  const client = getClient(EVENT)

  const query = `PartitionKey eq '${event.partitionKey.trim()}'`

  const entities = client.listEntities({
    queryOptions: { filter: `${query}` }
  })

  for await (const entity of entities) {
    await client.deleteEntity(entity.partitionKey, entity.rowKey)
  }
}

module.exports = {
  purgeEventRecords
}
