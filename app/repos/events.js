const { EVENT } = require('../constants/event-types')
const { getClient } = require('../storage')
const { getPseudonymsAsMap } = require('./pseudonyms')
const systemPseudonyms = require('../constants/system-pseudonyms')
const { timingLog } = require('../lib/log-helper')

const constructQueryText = pks => {
  const queries = pks.map(x => `PartitionKey eq '${x.trim()}'`)
  return queries.join(' or ')
}

const getEvents = async (pks) => {
  try {
    let logTime = timingLog('repos/events start 1')

    const pseudonyms = await getPseudonymsAsMap()

    logTime = timingLog('repos/events mid 2', logTime)

    const client = getClient(EVENT)

    logTime = timingLog('repos/events mid 3', logTime)

    const query = constructQueryText(pks)

    logTime = timingLog('repos/events mid 4', logTime)

    const entities = client.listEntities({
      queryOptions: { filter: `${query}` }
    })

    logTime = timingLog('repos/events mid 5', logTime)

    const results = []
    for await (const entity of entities) {
      results.push(mapEntity(entity, pseudonyms))
    }

    timingLog('repos/events end 6', logTime)

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
