const { v4: uuidv4 } = require('uuid')
const { createRowWithoutExtraTimestamp } = require('./create-row')
const { EXTERNAL_EVENT } = require('../../constants/event-types')

const getTimeString = () => {
  return new Date().toISOString()
}

const createUserEntity = (username, event) => {
  return createRowWithoutExtraTimestamp(`user_${username}`, `${getTimeString()}|${uuidv4()}`, EXTERNAL_EVENT, event)
}

const createDogEntity = (pk, event) => {
  const row = createRowWithoutExtraTimestamp(`dog_${pk}`, `${getTimeString()}|${uuidv4()}`, EXTERNAL_EVENT, event)
  console.log('JB row', row)
  return row
}

const createOwnerEntity = (pk, event) => {
  return createRowWithoutExtraTimestamp(`owner_${pk}`, `${getTimeString()}|${uuidv4()}`, EXTERNAL_EVENT, event)
}

const createDateEntity = (event) => {
  return createRowWithoutExtraTimestamp('date', `${getTimeString()}|${uuidv4()}`, EXTERNAL_EVENT, event)
}

const createSearchEntity = (term, event) => {
  return createRowWithoutExtraTimestamp('search', `${term.toLowerCase()}|${getTimeString()}|${uuidv4()}`, EXTERNAL_EVENT, event)
}

const createDogEntitiesFromOwner = (event) => {
  const payload = JSON.parse(event.data?.message)
  const { details } = payload
  const { dogIndexNumbers, pk } = details
  const entitiesList = dogIndexNumbers.map((dogIndex) => {
    const dogViewEvent = { ...event }
    dogViewEvent.type = dogViewEvent.type.replace('.view.owner', '.view.dog')
    dogViewEvent.data.message = JSON.stringify({ actioningUser: payload.actioningUser, details: { pk: dogIndex, source: `view-owner-${pk}` } })
    return createDogEntity(dogIndex, dogViewEvent)
  })
  return entitiesList
}

const createSearchEntities = (event) => {
  const payload = JSON.parse(event.data?.message)
  const { details, actioningUser } = payload
  const entitiesList = details?.searchTerms.split(' ').map((term) => {
    return createSearchEntity(term, event)
  })
  entitiesList.push(createUserEntity(actioningUser?.username, event))
  entitiesList.push(createDateEntity(event))
  return entitiesList
}

const getUsername = event => {
  const payload = JSON.parse(event.data?.message)
  const { actioningUser } = payload
  return actioningUser?.username
}

module.exports = {
  createUserEntity,
  createDateEntity,
  createDogEntity,
  createOwnerEntity,
  createSearchEntities,
  createDogEntitiesFromOwner,
  getUsername
}
