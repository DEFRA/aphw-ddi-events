const getTimestamp = (eventTime) => {
  return new Date(eventTime).getTime()
}

module.exports = {
  getTimestamp
}
