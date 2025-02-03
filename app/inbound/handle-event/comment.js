const { COMMENT_EVENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')
const { createRow } = require('./create-row')
const { createIfNotExists } = require('./create-if-not-exists')

const saveComment = async (event) => {
  const entity = createRow(event.id, event.id, COMMENT_EVENT, event)

  const client = getClient(COMMENT_EVENT)
  await createIfNotExists(client, entity)
}

module.exports = {
  saveComment
}
