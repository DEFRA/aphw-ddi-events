const { EVENT } = require('../constants/event-types')
const { getClient } = require('../storage')
const { getPseudonymsAsMap } = require('./pseudonyms')
const systemPseudonyms = require('../constants/system-pseudonyms')

const constructQueryText = pks => {
  const queries = pks.map(x => `PartitionKey eq '${x.trim()}'`)
  return queries.join(' or ')
}

const getEvents = async (pks) => {
  try {
    console.time('repos/events start 1')

    const pseudonyms = await getPseudonymsAsMap()

    console.timeEnd('repos/events start 1')
    console.time('repos/events mid 2')

    const client = getClient(EVENT)

    console.timeEnd('repos/events mid 2')
    console.time('repos/events mid 3')

    const query = constructQueryText(pks)

    console.timeEnd('repos/events mid 3')
    console.time('repos/events mid 4')

    const entities = client.listEntities({
      queryOptions: { filter: `${query}` }
    })

    console.timeEnd('repos/events mid 4')
    console.time('repos/events mid 5')

    const results = []
    for await (const entity of entities) {
      results.push(mapEntity(entity, pseudonyms))
    }

    console.timeEnd('repos/events mid 5')

    return results
  } catch (err) {
    console.log('Error getting events', err.message)
    throw err
  }
}

const changeUsernameToPseudonym = (username, pseudonyms) => {
  return pseudonyms.get(username.toLowerCase()) ?? systemPseudonyms[username] ?? 'Index user'
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
