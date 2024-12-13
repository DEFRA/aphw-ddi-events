const timingLog = (message, timestamp = null) => {
  const startTime = timestamp ?? new Date()
  const timeNow = new Date()
  const durationInMillis = Math.round(timeNow.getTime() - startTime.getTime())
  console.log(`${message} duration=${durationInMillis} mSecs`)
  return timeNow
}

module.exports = {
  timingLog
}
