const { createIfNotExists } = require('../../../../app/inbound/handle-event/create-if-not-exists')

const clientMockWithNoRows = () => {
  return (async function * () {
  })()
}

const clientMockWithExistingRows = () => {
  return (async function * () {
    yield { partitionKey: 'pk1', rowKey: 'row1' }
    yield { partitionKey: 'pk2', rowKey: 'row2' }
    yield { partitionKey: 'pk3', rowKey: 'row3' }
    yield { partitionKey: 'pk4', rowKey: 'row4' }
  })()
}
const listSomeEntitiesMock = jest.fn(() => clientMockWithExistingRows())
const listNoEntitiesMock = jest.fn(() => clientMockWithNoRows())

const clientWithSomeRows = {
  createEntity: jest.fn(),
  listEntities: listSomeEntitiesMock
}

const clientWithNoRows = {
  createEntity: jest.fn(),
  listEntities: listNoEntitiesMock
}

describe('create-if-not-exists', () => {
  test('should handle not exists', async () => {
    await createIfNotExists(clientWithNoRows, { entity: { partitionKey: 'pk1', rowKey: 'row1' } })
  })

  test('should handle where existing rows', async () => {
    await createIfNotExists(clientWithSomeRows, { entity: { partitionKey: 'pk1', rowKey: 'row1' } })
  })
})
