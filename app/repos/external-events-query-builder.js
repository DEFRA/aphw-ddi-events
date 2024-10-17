const constructSearchFilter = (pks, fromDate, toDate) => {
  const localFromDate = fromDate && fromDate !== '' ? fromDate : ''
  const localToDate = toDate && toDate !== '' ? toDate : ''
  const queries = pks.map(pk => {
    // A 'like' query achieved by using a range of 'string1 to string2' where string2 has its last digit has its ascii code incremented by 1
    const lowerLimit = `${pk.trim()}|${localFromDate}`
    const upperLimit = `${pk.trim()}|${localToDate}`
    const upperLimitShifted = upperLimit.substring(0, upperLimit.length - 1) + String.fromCharCode(upperLimit.charCodeAt(upperLimit.length - 1) + 1)
    return `RowKey ge '${lowerLimit}' and RowKey lt '${upperLimitShifted}'`
  })
  return 'PartitionKey eq \'search\' and ((' + queries.join(') or (') + '))'
}

const constructDateFilter = (_pk, fromDate, toDate) => {
  return `PartitionKey eq 'date' and RowKey gt '${fromDate}' and RowKey lt '${toDate}'`
}

const constructDogFilter = (pk, fromDate, toDate) => {
  let query = `PartitionKey eq 'dog_${pk}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructOwnerFilter = (pk, fromDate, toDate) => {
  let query = `PartitionKey eq 'owner_${pk}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructUserFilter = (pk, fromDate, toDate) => {
  let query = `PartitionKey eq 'user_${pk}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

module.exports = {
  constructSearchFilter,
  constructDateFilter,
  constructDogFilter,
  constructOwnerFilter,
  constructUserFilter
}
