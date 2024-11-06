const constructSearchFilter = (pks, fromDate, toDate) => {
  const localFromDate = fromDate && fromDate !== '' ? fromDate : ''
  const localToDate = toDate && toDate !== '' ? toDate : ''
  const queries = pks.map(pk => {
    // A 'like' query achieved by using a range of 'string1 to string2' where string2 has its last digit has its ascii code incremented by 1
    const lowerLimit = `${pk.trim().toLowerCase()}|${localFromDate}`
    const upperLimit = `${pk.trim().toLowerCase()}|${localToDate}`
    const upperLimitShifted = upperLimit.substring(0, upperLimit.length - 1) + String.fromCharCode(upperLimit.charCodeAt(upperLimit.length - 1) + 1)
    return `RowKey ge '${lowerLimit}' and RowKey lt '${upperLimitShifted}'`
  })
  return 'PartitionKey eq \'search\' and ((' + queries.join(') or (') + '))'
}

const constructDateFilter = (_pk, fromDate, toDate) => {
  let query = 'PartitionKey eq \'date\''
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructDogFilter = (pk, fromDate, toDate) => {
  let query = `PartitionKey eq 'dog_${pk.toUpperCase()}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructOwnerFilter = (pk, fromDate, toDate) => {
  let query = `PartitionKey eq 'owner_${pk.toUpperCase()}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructUserFilter = (pk, fromDate, toDate) => {
  let query = `PartitionKey eq 'user_${pk.toLowerCase()}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructLoginFilter = (_pk, fromDate, toDate) => {
  let query = 'PartitionKey eq \'login\''
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
  constructUserFilter,
  constructLoginFilter
}
