const externalEventsFromTable = [
  {
    partitionKey: 'ED12345',
    rowKey: '101',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    timestamp: '2024-04-11T08:00:43.8103903Z',
    username: 'jane-doe',
    details: {
      pk: 'ED12345'
    }
  },
  {
    partitionKey: 'ED12345',
    rowKey: '102',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    timestamp: '2024-04-11T08:00:43.8624424Z',
    username: 'martin-smith',
    details: {
      pk: 'ED12345'
    }
  },
  {
    partitionKey: 'ED12345',
    rowKey: '103',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    timestamp: '2024-04-11T07:49:17.6672581Z',
    username: 'Phil-Jones',
    details: {
      pk: 'ED12345'
    }
  },
  {
    partitionKey: 'ED12345',
    rowKey: '104',
    timestamp: '2024-04-11T08:01:24.8314117Z',
    type: 'uk.gov.defra.ddi.event.external.view.dog',
    username: 'internal-user',
    details: {
      pk: 'ED12345'
    }
  }
]

module.exports = {
  externalEventsFromTable
}
