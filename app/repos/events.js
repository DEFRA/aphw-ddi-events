const { EVENT } = require('../constants/event-types')
const { getClient } = require('../storage')
const { getPseudonymsAsMap } = require('./pseudonyms')
const systemPseudonyms = require('../constants/system-pseudonyms')

const getEvents = async (pks) => {
  try {
    console.time('repos/events getPseudonymsAsMap')

    const pseudonyms = await getPseudonymsAsMap()

    console.timeEnd('repos/events getPseudonymsAsMap')
    console.time('repos/events getClient')

    const client = getClient(EVENT)

    console.timeEnd('repos/events getClient')

    const results = []
    for (const pk of pks) {
      console.time('repos/events listEntities')

      console.log('repos/events query', `PartitionKey eq '${pk.trim()}'`)
      /**
       * @type {PagedAsyncIterableIterator}
       */
      const entityPages = client.listEntities({
        queryOptions: { filter: `PartitionKey eq '${pk.trim()}'` }
      }).byPage({
        maxPageSize: 100
      })

      console.timeEnd('repos/events listEntities')
      console.time('repos/events loop entities')

      for await (const page of entityPages) {
        for (const entity of page) {
          results.push(mapEntity(entity, pseudonyms))
        }
      }

      console.timeEnd('repos/events loop entities')
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
