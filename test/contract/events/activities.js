const changeOfAddressSent = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.activity',
  source: 'aphw-ddi-portal',
  id: '924cc5f3-de84-4413-ad90-bc942ffb7d3a',
  partitionKey: 'P-B218-7D57',
  time: '2024-04-12T10:14:34.452Z',
  subject: 'DDI Activity Change of address form',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"activity":{"activity":"1","activityType":"sent","pk":"ED300000","source":"dog","activityDate":"2024-04-12T00:00:00.000Z","targetPk":"owner","activityLabel":"Change of address form"},"operation":"activity"}'
  }
}

const deathOfDogSent = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.activity',
  source: 'aphw-ddi-portal',
  id: 'a3887472-8478-4833-b0c5-304a1688ea84',
  partitionKey: 'ED300000',
  time: '2024-04-12T10:17:40.086Z',
  subject: 'DDI Activity Death of a dog form',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"activity":{"activity":"2","activityType":"sent","pk":"ED300000","source":"dog","activityDate":"2024-04-12T00:00:00.000Z","targetPk":"dog","activityLabel":"Death of a dog form"},"operation":"activity"}'
  }
}

const witnessStatementSent = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.activity',
  source: 'aphw-ddi-portal',
  id: '7b642d96-2ef9-49bc-9f0f-1649b90caf0f',
  partitionKey: 'ED300000',
  time: '2024-04-12T10:18:22.491Z',
  subject: 'DDI Activity Witness statement',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"activity":{"activity":"3","activityType":"sent","pk":"ED300000","source":"dog","activityDate":"2024-04-12T00:00:00.000Z","targetPk":"dog","activityLabel":"Witness statement"},"operation":"activity"}'
  }
}

const policeCorrespondaenceReceived = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.activity',
  source: 'aphw-ddi-portal',
  id: '37ae12ad-da8d-4489-a4a9-4a0e9e670e8a',
  partitionKey: 'ED300000',
  time: '2024-04-12T10:19:02.587Z',
  subject: 'DDI Activity Police correspondence',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"activity":{"activity":"4","activityType":"received","pk":"ED300000","source":"dog","activityDate":"2024-04-12T00:00:00.000Z","targetPk":"dog","activityLabel":"Police correspondence"},"operation":"activity"}'
  }
}

const witnessStatementRequestReceived = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.activity',
  source: 'aphw-ddi-portal',
  id: '808b125d-c5c6-45a8-b312-70797200d0f2',
  partitionKey: 'ED300000',
  time: '2024-04-12T10:19:57.926Z',
  subject: 'DDI Activity Witness statement request',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"activity":{"activity":"5","activityType":"received","pk":"ED300000","source":"dog","activityDate":"2024-04-12T00:00:00.000Z","targetPk":"dog","activityLabel":"Witness statement request"},"operation":"activity"}'
  }
}

const judicialReviewNoticeReceived = {
  specversion: '1.0',
  type: 'uk.gov.defra.ddi.event.activity',
  source: 'aphw-ddi-portal',
  id: 'eea88fdf-71b5-4878-b240-7b864b635899',
  partitionKey: 'ED300000',
  time: '2024-04-12T10:22:41.252Z',
  subject: 'DDI Activity Judicial review notice',
  datacontenttype: 'text/json',
  data: {
    message: '{"actioningUser":{"username":"dev@test.com","displayname":"Developer"},"activity":{"activity":"6","activityType":"received","pk":"ED300000","source":"dog","activityDate":"2024-04-12T00:00:00.000Z","targetPk":"dog","activityLabel":"Judicial review notice"},"operation":"activity"}'
  }
}

module.exports = {
  changeOfAddressSent,
  deathOfDogSent,
  witnessStatementSent,
  policeCorrespondaenceReceived,
  witnessStatementRequestReceived,
  judicialReviewNoticeReceived
}
