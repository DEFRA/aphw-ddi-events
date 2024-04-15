const receiver = require('./mocks/messaging/receiver')
const { processEventMessage } = require('../app/messaging/process-event-message')
const { getClient, initialiseTables } = require('../app/storage')
const { EVENT } = require('../app/constants/event-types')
const {
  changeOfAddressSent, deathOfDogSent, witnessStatementSent, policeCorrespondaenceReceived,
  witnessStatementRequestReceived, judicialReviewNoticeReceived
} = require('./contract/events/activities')
const { createCdoEventV1WithDogs, createCdoV2WithSingleDog, createCdoV3WithSingleDog } = require('./contract/events/create')
const {
  updateDogDetails, updateDogDetailsFromNull, updateExemptionNull, updatePersonDetails, updateStatusDog, updateExemption,
  updatePersonDetailsFromNull
} = require('./contract/events/updates')

const eventMessageHelper = async (body) => {
  return processEventMessage({ body }, receiver)
}

const intialiseTableStorage = () => {
  initialiseTables()
}
/**
 * @param {'event'|'comment'|'warning'} type
 * @returns {Promise<void>}
 */
const truncateTable = async (type) => {
  const eventClient = getClient(type)

  const allEntities = eventClient.listEntities()
  for await (const entity of allEntities) {
    await eventClient.deleteEntity(entity)
  }
}

const truncateTables = async () => {
  await truncateTable(EVENT)
}

const createCdos = async () => {
  await addEvents([createCdoEventV1WithDogs, createCdoV2WithSingleDog, createCdoV3WithSingleDog])
}

/**
 * @param {*[]} events
 * @returns {Promise<void>}
 */
const addEvents = async (events) => {
  for (const event of events) {
    await eventMessageHelper(event)
  }
}

const addAllActivities = async () => {
  await addEvents([changeOfAddressSent, deathOfDogSent, witnessStatementSent, policeCorrespondaenceReceived, witnessStatementRequestReceived, judicialReviewNoticeReceived])
}

const addAllUpdates = async () => {
  await addEvents([updateDogDetails, updateDogDetailsFromNull, updatePersonDetails, updatePersonDetailsFromNull, updateStatusDog, updateExemption, updateExemptionNull])
}

const logAllRows = async () => {
  const eventClient = getClient(EVENT)

  const allEntities = eventClient.listEntities()
  for await (const entity of allEntities) {
    console.log('Logging entity:', JSON.stringify(entity))
  }
}

module.exports = {
  intialiseTableStorage,
  eventMessageHelper,
  truncateTables,
  createCdos,
  addAllActivities,
  addAllUpdates,
  addEvents,
  logAllRows
}
