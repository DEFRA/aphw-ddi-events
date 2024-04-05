const { v4: uuidv4 } = require('uuid')
const { getPseudonymClient } = require('../storage')

/**
 * @typedef {{
 *  rowKey: string,
 *  data: string
 *  }} PseudonymEntity
 */

/**
 * @typedef {{
 *  pseudonym: string,
 *  rowKey: string,
 *  username: string
 *  }} MappedEntity
 */

/**
 * @returns {Promise<MappedEntity[]>}
 */
const getPseudonyms = async () => {
  try {
    const client = getPseudonymClient()

    const entities = client.listEntities()
    /**
     * @type {MappedEntity[]}
     */
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
    const results = await getPseudonyms()
    const resultMap = new Map()

    for (const mappedEntity of results) {
      resultMap.set(mappedEntity.username, mappedEntity.pseudonym)
    }

    return resultMap
  } catch (err) {
    console.log('Error getting pseudonyms as map', err.message)
    throw err
  }
}

/**
 * @param {PseudonymEntity} entity
 * @returns {[string, string, string]}
 */
const mapEntity = (entity) => {
  const data = JSON.parse(entity.data)
  const { username, pseudonym } = data

  return [username, pseudonym, entity.rowKey]
}

/**
 * @param {PseudonymEntity} entity
 * @returns {MappedEntity}
 */
const mapEntityAsJson = (entity) => {
  const mapped = mapEntity(entity)
  return {
    username: mapped[0],
    pseudonym: mapped[1],
    rowKey: mapped[2]
  }
}

/**
 * @typedef {{
 *   'odata.metadata': 'http://storage',
 *   etag: 'W/"datetime\'2024-04-05T07%3A26%3A47.1373605Z\'"',
 *   partitionKey: 'pseudonym',
 *   rowKey: '11a24722-2766-4dd7-ac5c-ec0d44602170',
 *   data: '{"username":"Cassie.Bartell71","pseudonym":"Rod"}',
 *   timestamp: '2024-04-05T07:26:47.1373605Z'
 * }} GetEntityDto
 */

/**
 * @param {{username: string; pseudonym: string}} user
 * @returns {{partitionKey: string, data: string, rowKey: string}}
 */
const createRow = (user) => {
  return {
    partitionKey: 'pseudonym',
    rowKey: uuidv4(),
    data: JSON.stringify(user)
  }
}

/**
 * @param {{username: string; pseudonym: string}} payload
 * @returns {Promise<void>}
 */
const addUser = async (payload) => {
  const entity = createRow({ username: payload.username, pseudonym: payload.pseudonym })
  const client = getPseudonymClient()
  await client.createEntity(entity)

  const createdEntity = await client.getEntity('pseudonym', entity.rowKey)
  return mapEntityAsJson(createdEntity)
}

const removeUser = async (username) => {

}

module.exports = {
  getPseudonyms,
  getPseudonymsAsMap,
  addUser,
  removeUser
}
