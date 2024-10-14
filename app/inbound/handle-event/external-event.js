const { createRow } = require('./create-row')
const { EXTERNAL_EVENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')
const { createIfNotExists } = require('./create-if-not-exists')
const saveExternalEvent = async (event) => {
  const entity = createRow(event.partitionKey ?? event.id, event.id, EXTERNAL_EVENT, event)

  const client = await getClient(EXTERNAL_EVENT)
  await createIfNotExists(client, entity)
}

module.exports = {
  saveExternalEvent
}
