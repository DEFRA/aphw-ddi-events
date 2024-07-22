const { v4: uuidv4 } = require('uuid')
const { PSEUDONYM } = require('../constants/entity-names')
const { ADMIN_EVENT_PREFIX } = require('../constants/event-prefixes')
const { saveEvent } = require('../inbound/handle-event/event')
const { isUserValid } = require('../auth/get-user')

const auditAdd = async (entityName, details, callingUser) => {
  const event = constructEventForAdd(entityName, details, callingUser)
  await saveEvent(event)
}

const auditRemove = async (entityName, details, callingUser) => {
  const event = constructEventForRemove(entityName, details, callingUser)
  await saveEvent(event)
}

/**
 * @param entityName
 * @param details
 * @param callingUser
 * @returns {ValidEvent}
 */
const constructEventForAdd = (entityName, details, callingUser) => {
  validateUserAndEntity(callingUser, entityName)

  /**
   * @type {ValidEvent}
   */
  const event = {
    id: uuidv4(),
    time: new Date(),
    partitionKey: `${ADMIN_EVENT_PREFIX}${entityName}`,
    subject: 'DDI Admin Add Pseudonym',
    data: {
      message: {
        actioningUser: callingUser,
        operation: 'add pseudonym',
        added: {
          username: details.username,
          pseudonym: details.pseudonym
        }
      }
    }
  }

  return event
}

/**
 * @param entityName
 * @param details
 * @param callingUser
 * @returns {ValidEvent}
 */
const constructEventForRemove = (entityName, details, callingUser) => {
  validateUserAndEntity(callingUser, entityName)

  /**
   * @type {ValidEvent}
   */
  const event = {
    id: uuidv4(),
    time: new Date(),
    partitionKey: `${ADMIN_EVENT_PREFIX}${entityName}`,
    subject: 'DDI Admin Remove Pseudonym',
    data: {
      message: {
        actioningUser: callingUser,
        operation: 'remove pseudonym',
        removed: {
          username: details.username
        }
      }
    }
  }

  return event
}

const validateUserAndEntity = (user, entityName) => {
  if (!isUserValid(user)) {
    throw new Error(`Username and displayname are required for auditing event of entity ${entityName}`)
  }

  if (entityName !== PSEUDONYM) {
    throw new Error(`Invalid entity (${entityName}) for admin auditing`)
  }
}

module.exports = {
  auditAdd,
  auditRemove
}
