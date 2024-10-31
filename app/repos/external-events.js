const { EXTERNAL_EVENT } = require('../constants/event-types')
const { getClient } = require('../storage')
const {
  constructSearchFilter, constructDateFilter, constructDogFilter, constructOwnerFilter, constructUserFilter,
  constructLoginFilter
} = require('./external-events-query-builder')

const getExternalEvents = async (queryType, pks, fromDate, toDate) => {
  try {
    const client = getClient(EXTERNAL_EVENT)

    let filterText
    if (queryType === 'search') {
      filterText = constructSearchFilter(pks.split(','), fromDate, toDate)
    } else if (queryType === 'date') {
      filterText = constructDateFilter(pks, fromDate, toDate)
    } else if (queryType === 'dog') {
      filterText = constructDogFilter(pks, fromDate, toDate)
    } else if (queryType === 'owner') {
      filterText = constructOwnerFilter(pks, fromDate, toDate)
    } else if (queryType === 'user') {
      filterText = constructUserFilter(pks, fromDate, toDate)
    } else if (queryType === 'login') {
      filterText = constructLoginFilter(pks, fromDate, toDate)
    } else {
      throw new Error('Not implemented')
    }

    const entities = client.listEntities({
      queryOptions: { filter: `${filterText}` }
    })

    const results = []
    for await (const entity of entities) {
      results.push(mapEntity(entity))
    }

    return results
  } catch (err) {
    console.log('Error getting external events', err.message)
    throw err
  }
}

const mapEntity = (entity) => {
  const data = JSON.parse(entity.data)
  const message = JSON.parse(data.message)
  const username = message.actioningUser?.username

  delete message.actioningUser

  message.username = username
  message.timestamp = entity.time
  message.type = entity.type
  message.rowKey = entity.rowKey
  message.partitionKey = entity.partitionKey

  return message
}

module.exports = {
  getExternalEvents
}
