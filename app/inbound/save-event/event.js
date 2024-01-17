const { EVENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')
const { createRow } = require('./create-row')
const { createIfNotExists } = require('./create-if-not-exists')

const saveEvent = async (event) => {
  const entity = createRow(event.id, event.id, EVENT, event)

  const client = getClient(EVENT)
  await createIfNotExists(client, entity)
}

module.exports = {
  saveEvent
}
