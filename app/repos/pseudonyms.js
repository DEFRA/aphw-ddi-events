const { v4: uuidv4 } = require('uuid')
const { getPseudonymClient } = require('../storage')

const getPseudonyms = async () => {
  try {
    const client = getPseudonymClient()

    const entities = client.listEntities()

    const results = []
    for await (const entity of entities) {
      results.push(mapEntityAsJson(entity))
    }

    return results
  } catch (err) {
    console.log('Error getting pseudonyms', err.message)
    throw err
  }
}

const getPseudonymsAsMap = async () => {
  try {
    const entities = await getPseudonyms()

    const resultMap = new Map()

    for (const entity of entities) {
      console.log('entity', entity)
      const [key, value] = mapEntity(entity)
      resultMap.set(key, value)
    }

    return resultMap
  } catch (err) {
    console.log('Error getting pseudonyms as map', err.message)
    throw err
  }
}

const mapEntity = (entity) => {
  const data = JSON.parse(entity.data)
  const { username, pseudonym } = data

  return [username, pseudonym, entity.rowKey]
}

const mapEntityAsJson = (entity) => {
  const mapped = mapEntity(entity)
  return {
    username: mapped[0],
    pseudonym: mapped[1],
    rowKey: mapped[2]
  }
}

const createRow = (user) => {
  return {
    partitionKey: 'pseudonym',
    rowKey: uuidv4(),
    data: JSON.stringify(user)
  }
}

const addUser = async (payload) => {
  const entity = createRow({ username: payload.username, pseudonym: payload.pseudonym })
  const client = getPseudonymClient()
  await client.createEntity(entity)
}

const removeUser = async (username) => {

}

module.exports = {
  getPseudonyms,
  getPseudonymsAsMap,
  addUser,
  removeUser
}
