jest.mock('../../../../app/storage')
const { getClient } = require('../../../../app/storage')

jest.mock('../../../../app/inbound/handle-event/create-if-not-exists')
const { createIfNotExists } = require('../../../../app/inbound/handle-event/create-if-not-exists')

const { saveComment } = require('../../../../app/inbound/handle-event/comment')

describe('comment', () => {
  test('should handle warning type', async () => {
    const event = {
      id: 'ED12345',
      event: {
        data: {
          fieldName1: 'fieldValue1'
        }
      }
    }
    await saveComment(event)
    expect(getClient).toHaveBeenCalledWith('comment')
    expect(createIfNotExists).toHaveBeenCalledWith(
      undefined,
      {
        category: 'comment',
        data: undefined,
        event: {
          data: {
            fieldName1: 'fieldValue1'
          }
        },
        id: 'ED12345',
        partitionKey: 'ED12345',
        rowKey: expect.anything()
      }
    )
  })
})
