const { COMMENT } = require('../../constants/event-types')
const { getClient } = require('../../storage')
const { createRow } = require('./create-row')
const { createIfNotExists } = require('./create-if-not-exists')

const saveComment = async (comment) => {
  const client = getClient(EVENT)
}

module.exports = {
  saveComment
}
