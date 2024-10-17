const addYears = (date, years) => {
  const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  newDate.setFullYear(newDate.getFullYear() + years)
  return newDate
}

const addMinutes = (date, minutes) => {
  const newDate = new Date(date)
  newDate.setTime(newDate.getTime() + (minutes * 60 * 1000))
  return newDate
}

const dateTodayOrInFuture = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkedDate = new Date(date)
  checkedDate.setHours(0, 0, 0, 0)
  return checkedDate.getTime() >= today.getTime()
}

module.exports = {
  addYears,
  addMinutes,
  dateTodayOrInFuture
}
