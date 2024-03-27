const { PSEUDONYM } = require('../constants/event-types')
const { getClient } = require('../storage')

const getPseudonyms = async () => {
  try {
    const client = getClient(PSEUDONYM)

    const entities = client.listEntities()

    const resultMap = Map()
    for await (const entity of entities) {
      resultMap.add(mapEntity(entity))
    }

    return resultMap
  } catch (err) {
    console.log('Error getting pseudonyms', err.message)
    throw err
  }
}

const mapEntity = (entity) => {
  const data = JSON.parse(entity.data)

  /*
  message.timestamp = entity.time
  message.type = entity.type
  message.rowKey = entity.rowKey
  message.subject = entity.subject
  */
  return data
}

module.exports = {
  getPseudonyms
}
