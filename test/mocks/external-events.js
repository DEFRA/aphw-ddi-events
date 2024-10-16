const externalEventsFromTable = [
  {
    partitionKey: 'ED12345',
    rowKey: '101',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    timestamp: '2024-04-11T08:00:43.8103903Z',
    data: JSON.stringify({
      username: 'jane-doe',
      pseudonym: 'John'
    })
  },
  {
    partitionKey: 'ED12345',
    rowKey: '102',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    timestamp: '2024-04-11T08:00:43.8624424Z',
    data: JSON.stringify({
      username: 'martin-smith',
      pseudonym: 'Joe'
    })
  },
  {
    partitionKey: 'ED12345',
    rowKey: '103',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    timestamp: '2024-04-11T07:49:17.6672581Z',
    data: JSON.stringify({
      username: 'Phil-Jones',
      pseudonym: 'martin'
    })
  },
  {
    partitionKey: 'ED12345',
    rowKey: '104',
    timestamp: '2024-04-11T08:01:24.8314117Z',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    data: JSON.stringify({
      username: 'internal-user',
      pseudonym: 'Hal'
    })
  }
]

module.exports = {
  externalEventsFromTable
}
