const COMMON_EVENT_PREFIX = 'uk.gov.defra.ddi.'

module.exports = {
  EVENT_PREFIX: `${COMMON_EVENT_PREFIX}event.`,
  PURGE_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}event.delete.permanent`,
  COMMENT_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}comment.`,
  WARNING_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}warning.`,
  ADMIN_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}admin.`,
  EXTERNAL_EVENT_PREFIX: `${COMMON_EVENT_PREFIX}external.`
}
