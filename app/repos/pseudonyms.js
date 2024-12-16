const { v4: uuidv4 } = require('uuid')
const { getPseudonymClient } = require('../storage')
const { DuplicateResourceError } = require('../errors/duplicateResourceError')
const { ResourceNotFoundError } = require('../errors/resourceNotFound')
const { auditAdd, auditRemove } = require('../lib/audit-helper')
const { PSEUDONYM } = require('../constants/entity-names')

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

const sortBy = (key, ascending) => (a, b) => {
  const order = ascending ? [1, -1] : [-1, 1]

  if (a[key] > b[key]) {
    return order[0]
  }
  if (a[key] < b[key]) {
    return order[1]
  }

  return 0
}

const sortByTimestamp = (ascending = true) => {
  return sortBy('timestamp', ascending)
}

const sortByUsername = (ascending = true) => {
  return sortBy('username', ascending)
}
/**
 * @returns {Promise<MappedEntity[]>}
 */
const getPseudonyms = async () => {
  try {
    console.time('repos/pseudonyms getPseudonyms getPseudonymClient')

    const client = getPseudonymClient()

    console.timeEnd('repos/pseudonyms getPseudonyms getPseudonymClient')
    console.time('repos/pseudonyms getPseudonyms listEntities')

    console.log('~~~~~~ Chris Debug ~~~~~~ ', 'Client.listEntities()', client.listEntities())
    /**
     * @type {AsyncIterableIterator<StorageEntity>}
     */
    const entityIterator = client.listEntities().byPage({
      maxPageSize: 100
    })

    console.timeEnd('repos/pseudonyms getPseudonyms listEntities')
    console.time('repos/pseudonyms getPseudonyms loop entities')

    /**
     * @type {StorageEntity[]}
     */
    const entities = []
    for await (const entity of entityIterator) {
      for (const pseudonym of entity) {
        entities.push(pseudonym)
      }
    }

    console.timeEnd('repos/pseudonyms getPseudonyms loop entities')
    console.time('repos/pseudonyms getPseudonyms sortByTimestamp')

    const sortAlgorithm = sortByTimestamp(false)

    console.timeEnd('repos/pseudonyms getPseudonyms sortByTimestamp')
    console.time('repos/pseudonyms getPseudonyms sortedEntities')

    const sortedEntities = [...entities].sort(sortAlgorithm)

    console.timeEnd('repos/pseudonyms getPseudonyms sortedEntities')
    console.time('repos/pseudonyms getPseudonyms mapEntityAsJson')

    const res = sortedEntities.map(mapEntityAsJson)

    console.timeEnd('repos/pseudonyms getPseudonyms mapEntityAsJson')

    return res
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
      resultMap.set(mappedEntity.username.toLowerCase(), mappedEntity.pseudonym)
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
  const { username, pseudonym, timestamp } = data

  return [username, pseudonym, entity.rowKey, timestamp]
}

/**
 * @param {PseudonymEntity} entity
 * @returns {MappedEntity}
 */
const mapEntityAsJson = (entity) => {
  const [username, pseudonym, rowKey, timestamp] = mapEntity(entity)

  return {
    timestamp,
    username,
    pseudonym,
    rowKey
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
    partitionKey: PSEUDONYM,
    rowKey: uuidv4(),
    data: JSON.stringify(user)
  }
}

/**
 * @param {string} username
 * @returns {Promise<undefined|MappedEntity>}
 */
const findUserByUsername = async (username) => {
  const results = await getPseudonyms()

  return results.find(result => {
    return username.toLowerCase() === result.username.toLowerCase()
  })
}

/**
 * @param {{username: string; pseudonym: string}} payload
 * @param callingUser
 * @returns {Promise<MappedEntity>}
 */
const addUser = async (payload, callingUser) => {
  await addUserPreflightCheck(payload)
  const entity = createRow({ username: payload.username, pseudonym: payload.pseudonym })

  const client = getPseudonymClient()
  await client.createEntity(entity)
  const createdEntity = await client.getEntity(PSEUDONYM, entity.rowKey)

  await auditAdd(PSEUDONYM, payload, callingUser)

  return mapEntityAsJson(createdEntity)
}

const addUserPreflightCheck = async (payload) => {
  const results = await getPseudonyms()
  const errors = []

  results.forEach(result => {
    if (payload.username.toLowerCase() === result.username.toLowerCase()) {
      errors.push(`Resource already found with username ${result.username}.`)
    }
    if (payload.pseudonym.toLowerCase() === result.pseudonym.toLowerCase()) {
      errors.push(`Resource already found with pseudonym ${result.pseudonym}.`)
    }
  })

  if (errors.length) {
    throw new DuplicateResourceError(errors.join(' '))
  }
}

const removeUser = async (username, callingUser) => {
  const foundUser = await findUserByUsername(username)

  if (foundUser === undefined) {
    throw new ResourceNotFoundError(`Resource not found with username ${username}`)
  }

  const client = getPseudonymClient()
  await client.deleteEntity(PSEUDONYM, foundUser.rowKey)
  await auditRemove(PSEUDONYM, foundUser, callingUser)
}

module.exports = {
  getPseudonyms,
  getPseudonymsAsMap,
  addUserPreflightCheck,
  addUser,
  removeUser,
  sortByTimestamp,
  sortByUsername,
  findUserByUsername
}
