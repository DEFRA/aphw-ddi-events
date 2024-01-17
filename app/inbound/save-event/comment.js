const { COMMENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')
const { createRow } = require('./create-row')
const { createIfNotExists } = require('./create-if-not-exists')

const saveComment = async (comment) => {
  const entity = createRow(event.id, event.id, COMMENT, event)

  const client = getClient(COMMENT)
  await createIfNotExists(client, entity)
}

module.exports = {
  saveComment
}
