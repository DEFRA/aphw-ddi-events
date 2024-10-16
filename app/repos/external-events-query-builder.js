const constructSearchFilter = (pks, fromDate, toDate) => {
  const localFromDate = fromDate && fromDate !== '' ? fromDate : ''
  const localToDate = fromDate && fromDate !== '' ? fromDate : ''
  const queries = pks.map(x => `RowKey gt '${x.trim()}|${localFromDate}' and RowKey lt '${x.trim()}|${localToDate}'`)
  return 'PartitionKey eq \'search\' and (' + queries.join(' or ') + ')'
}

const constructDateFilter = (_pks, fromDate, toDate) => {
  return `PartitionKey eq 'date' and RowKey gt '${fromDate}' and RowKey lt '${toDate}'`
}

const constructViewDogFilter = (pks, fromDate, toDate) => {
  let query = `PartitionKey eq 'viewdog_${pks[0]}'`
  if (fromDate && fromDate !== '') {
    query += ` and RowKey gt '${fromDate}'`
  }
  if (toDate && toDate !== '') {
    query += ` and RowKey lt '${toDate}'`
  }
  return query
}

const constructViewOwnerFilter = (pks, fromDate, toDate) => {
  let query = `PartitionKey eq 'viewowner_${pks[0]}'`
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
  constructViewDogFilter,
  constructViewOwnerFilter,
  constructUserFilter
}
