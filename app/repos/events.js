const { EVENT } = require('../constants/event-types')
const { getClient } = require('../storage')

const getEvents = async (pks) => {
  try {
    const client = getClient(EVENT)

    const queries = pks.map(x => `PartitionKey eq '${x.trim()}'`)
    const query = queries.join(' or ')

    const entities = client.listEntities({
      queryOptions: { filter: `${query}` }
    })

    const results = []
    for await (const entity of entities) {
      results.push(mapEntity(entity))
    }

    return results
  } catch (err) {
    console.log('Error getting events', err.message)
    throw err
  }
}

const mapEntity = (entity) => {
  const data = JSON.parse(entity.data)
  const message = JSON.parse(data.message)

  translateOldStyleUsername(message)

  message.timestamp = entity.time
  message.type = entity.type
  message.rowKey = entity.rowKey
  message.subject = entity.subject

  return message
}

const translateOldStyleUsername = message => {
  if (message.username) {
    message.actioningUser = { username: message.username, displayname: message.username }
    delete message.username
  }
}

module.exports = {
  getEvents
}
