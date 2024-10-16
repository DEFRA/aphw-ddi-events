const { v4: uuidv4 } = require('uuid')
const { createRow } = require('./create-row')
const { EXTERNAL_EVENT } = require('../../constants/event-types')

const getTimeString = () => {
  return new Date().toISOString()
}

const createUserEntity = (username, event) => {
  return createRow(`user_${username}`, uuidv4(), EXTERNAL_EVENT, event)
}

const createDogEntity = (pk, event) => {
  return createRow(`dog_${pk}`, uuidv4(), EXTERNAL_EVENT, event)
}

const createOwnerEntity = (pk, event) => {
  return createRow(`owner_${pk}`, uuidv4(), EXTERNAL_EVENT, event)
}

const createDateEntity = (event) => {
  return createRow('date', `${getTimeString}|${uuidv4()}`, EXTERNAL_EVENT, event)
}

const createSearchEntity = (term, event) => {
  return createRow('search', `${term.toLowerCase()}|${getTimeString}|${uuidv4()}`, EXTERNAL_EVENT, event)
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
  getUsername
}
