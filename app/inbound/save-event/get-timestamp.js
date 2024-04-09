const getTimestamp = (eventTime) => {
  let timestampTime = eventTime

  if (isNaN(timestampTime)) {
    timestampTime = new Date()
  }
  return new Date(timestampTime).getTime()
}

module.exports = {
  getTimestamp
}
