const { EVENT } = require('../constants/event-types')
const { getClient } = require('../storage')
const { getPseudonymsAsMap } = require('./pseudonyms')
const systemPseudonyms = require('../constants/system-pseudonyms')

const getEvents = async (pks) => {
  try {
    const pseudonyms = await getPseudonymsAsMap()

    const client = getClient(EVENT)

    const results = []
    for (const pk of pks) {
      /**
       * @type {PagedAsyncIterableIterator}
       */
      const entityPages = client.listEntities({
        queryOptions: { filter: `PartitionKey eq '${pk.trim()}'` }
      }).byPage({
        maxPageSize: 100
      })

      for await (const page of entityPages) {
        for (const entity of page) {
          results.push(mapEntity(entity, pseudonyms))
        }
      }
    }

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
  changeUsernameToPseudonym
}
