const { EVENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')
const { createRow } = require('./create-row')
const { createIfNotExists } = require('./create-if-not-exists')

/**
 * @param {ValidEvent} event
 * @returns {Promise<void>}
 */
const saveEvent = async (event) => {
  const entity = createRow(event.partitionKey ?? event.id, event.id, EVENT, event)

  const client = getClient(EVENT)
  await createIfNotExists(client, entity)
}

module.exports = {
  saveEvent
}
