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

const constructDateFilter = (_pks, fromDate, toDate) => {
  return `PartitionKey eq 'date' and RowKey gt '${fromDate}' and RowKey lt '${toDate}'`
}

const constructDogFilter = (pks, fromDate, toDate) => {
  let query = `PartitionKey eq 'dog_${pks[0]}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructOwnerFilter = (pks, fromDate, toDate) => {
  let query = `PartitionKey eq 'owner_${pks[0]}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructUserFilter = (pks, fromDate, toDate) => {
  let query = `PartitionKey eq 'user_${pks[0]}'`
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
