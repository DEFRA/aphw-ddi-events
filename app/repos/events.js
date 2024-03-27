const { EVENT } = require('../constants/event-types')
const { getClient } = require('../storage')
const { getPseudonyms } = require('./pseudonyms')

const constructQueryText = pks => {
  const queries = pks.map(x => `PartitionKey eq '${x.trim()}'`)
  return queries.join(' or ')
}

const getEvents = async (pks) => {
  try {
    const pseudonyms = await getPseudonyms()

    const client = getClient(EVENT)

    const query = constructQueryText(pks)

    const entities = client.listEntities({
      queryOptions: { filter: `${query}` }
    })

    const results = []
    for await (const entity of entities) {
      results.push(mapEntity(entity, pseudonyms))
    }

    return results
  } catch (err) {
    console.log('Error getting events', err.message)
    throw err
  }
}

const changeUsernameToPseudonym = (username, pseudonyms) => {
  return pseudonyms.get(username) ?? 'Unknown'
}

const mapEntity = (entity, pseudonyms) => {
  const data = JSON.parse(entity.data)
  const message = JSON.parse(data.message)
  const username = message.username ?? message.actioningUser?.username

  if (message.username) {
    delete message.username
  }

  message.actioningUser = { displayname: changeUsernameToPseudonym(username, pseudonyms) }
  message.timestamp = entity.time
  message.type = entity.type
  message.rowKey = entity.rowKey
  message.subject = entity.subject

  return message
}

module.exports = {
  getEvents,
  changeUsernameToPseudonym,
  constructQueryText
}
