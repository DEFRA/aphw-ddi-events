jest.mock('../../../../app/storage')
const { getClient } = require('../../../../app/storage')

jest.mock('../../../../app/inbound/handle-event/create-if-not-exists')
const { createIfNotExists } = require('../../../../app/inbound/handle-event/create-if-not-exists')

const { saveWarningEvent } = require('../../../../app/inbound/handle-event/warning')

describe('warning', () => {
  test('should handle warning type', async () => {
    const event = {
      id: 'ED12345',
      type: 'acbd.warning.test.sub',
      event: {
        data: {
          fieldName1: 'fieldValue1'
        }
      }
    }
    await saveWarningEvent(event)
    expect(getClient).toHaveBeenCalledWith('warning')
    expect(createIfNotExists).toHaveBeenCalledWith(
      undefined,
      {
        category: 'warning',
        data: undefined,
        event: {
          data: {
            fieldName1: 'fieldValue1'
          }
        },
        id: 'ED12345',
        partitionKey: 'test.sub',
        rowKey: expect.anything(),
        type: 'acbd.warning.test.sub'
      }
    )
  })
})
