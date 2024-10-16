const { getTimestamp } = require('./get-timestamp')

/**
 * @typedef ValidEvent
 * @property {Object} [data]
 * @property {string|Date|number} id
 * @property {string|Date|number} time
 * @property {string} [partitionKey]
 * @property {string} [subject]
 */

/**
 * @param {*} partitionKey
 * @param {number|string} rowKey
 * @param {string} category
 * @param {ValidEvent} event
 * @returns {*&{partitionKey: string, data: (string|undefined), category, rowKey: string}}
 */
const createRow = (partitionKey, rowKey, category, event) => {
  const timestamp = getTimestamp(event.time)
  return {
    partitionKey: partitionKey.toString(),
    rowKey: `${rowKey}|${timestamp}`,
    category,
    ...event,
    data: event.data ? JSON.stringify(event.data) : undefined
  }
}

/**
 * @param {*} partitionKey
 * @param {number|string} rowKey
 * @param {string} category
 * @param {ValidEvent} event
 * @returns {*&{partitionKey: string, data: (string|undefined), category, rowKey: string}}
 */
const createRowWithoutExtraTimestamp = (partitionKey, rowKey, category, event) => {
  return {
    partitionKey: partitionKey.toString(),
    rowKey,
    category,
    ...event,
    data: event.data ? JSON.stringify(event.data) : undefined
  }
}

module.exports = {
  createRow,
  createRowWithoutExtraTimestamp
}
