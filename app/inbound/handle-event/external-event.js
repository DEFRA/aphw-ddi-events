const { EXTERNAL_EVENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')
const { createIfNotExists } = require('./create-if-not-exists')
const { createDateEntity, createDogEntity, createOwnerEntity, createSearchEntities, createUserEntity, getUsername } = require('./external-event-builder')

const saveExternalEvent = async (eventWithPk) => {
  const origPk = eventWithPk.partitionKey
  const event = { ...eventWithPk }
  delete event.partitionKey

  const client = await getClient(EXTERNAL_EVENT)

  if (event.type?.endsWith('.external.view.owner')) {
    await createIfNotExists(client, createUserEntity(getUsername(event), event))
    await createIfNotExists(client, createOwnerEntity(origPk, event))
    await createIfNotExists(client, createDateEntity(event))
  } else if (event.type?.endsWith('.external.view.dog')) {
    await createIfNotExists(client, createUserEntity(getUsername(event), event))
    await createIfNotExists(client, createDogEntity(origPk, event))
    await createIfNotExists(client, createDateEntity(event))
  } else if (event.type?.endsWith('.external.search')) {
    const entities = createSearchEntities(event)
    for (const entity of entities) {
      await createIfNotExists(client, entity)
    }
  }
}

module.exports = {
  saveExternalEvent
}
