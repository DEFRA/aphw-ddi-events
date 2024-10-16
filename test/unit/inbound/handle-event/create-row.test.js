const { createRow, createRowWithoutExtraTimestamp } = require('../../../../app/inbound/handle-event/create-row')
describe('create-row', () => {
  describe('createRow', () => {
    test('should create a row', () => {
      const row = createRow('uk.gov.defra.ddi.admin.pseudonym', 'abcd', 'event', {
        id: 'abcd',
        time: '2024-04-09',
        partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
        subject: 'DDI Admin Add Pseudonym',
        data: { message: { actioningUser: { username: 'internal-user', displayname: 'User, Internal' }, operation: 'add pseudonym', added: { username: 'Lauriane66', pseudonym: 'Jamel' } } }
      })
      expect(row).toEqual({
        id: 'abcd',
        time: '2024-04-09',
        rowKey: expect.any(String),
        category: 'event',
        partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
        subject: 'DDI Admin Add Pseudonym',
        data: '{"message":{"actioningUser":{"username":"internal-user","displayname":"User, Internal"},"operation":"add pseudonym","added":{"username":"Lauriane66","pseudonym":"Jamel"}}}'
      })
      const [rowKey, timestamp] = row.rowKey.split('|')

      expect(rowKey).toBe('abcd')
      expect(timestamp).not.toBe('NaN')
      expect(new Date(parseInt(timestamp)).toISOString()).not.toBeNaN()
    })
    test('should create a row given no data exists', () => {
      const row = createRow('uk.gov.defra.ddi.admin.pseudonym', 'abcd', 'event', {
        partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
        subject: 'DDI Admin Add Pseudonym'
      })

      expect(row).toEqual({
        rowKey: expect.any(String),
        category: 'event',
        partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
        subject: 'DDI Admin Add Pseudonym',
        data: undefined
      })
      const [rowKey, timestamp] = row.rowKey.split('|')

      expect(rowKey).toBe('abcd')
      expect(timestamp).not.toBe('NaN')
      expect(new Date(parseInt(timestamp)).toISOString()).not.toBeNaN()
    })
    test('should create a unique rowKey given no time exists in event', () => {
      const row = createRow('uk.gov.defra.ddi.admin.pseudonym', undefined, 'event', {
        partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
        subject: 'DDI Admin Add Pseudonym',
        data: { message: { actioningUser: { username: 'internal-user', displayname: 'User, Internal' }, operation: 'add pseudonym', added: { username: 'Lauriane66', pseudonym: 'Jamel' } } }
      })
      expect(row).toEqual({
        rowKey: expect.any(String),
        category: 'event',
        partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
        subject: 'DDI Admin Add Pseudonym',
        data: '{"message":{"actioningUser":{"username":"internal-user","displayname":"User, Internal"},"operation":"add pseudonym","added":{"username":"Lauriane66","pseudonym":"Jamel"}}}'
      })
      const [, timestamp] = row.rowKey.split('|')

      expect(timestamp).not.toBe('NaN')
    })
  })

  describe('createRowWithoutExtraTimestamp', () => {
    test('should create a row', () => {
      const row = createRowWithoutExtraTimestamp('ED123', '2024-02-15', 'event.external', {
        id: 'abcd',
        time: '2024-04-09',
        partitionKey: 'dog_ED123',
        data: { message: { actioningUser: { username: 'internal-user', displayname: 'User, Internal' }, details: { pk: 'ED123' } } }
      })
      expect(row).toEqual({
        id: 'abcd',
        time: '2024-04-09',
        rowKey: '2024-02-15',
        category: 'event.external',
        partitionKey: 'dog_ED123',
        data: '{"message":{"actioningUser":{"username":"internal-user","displayname":"User, Internal"},"details":{"pk":"ED123"}}}'
      })
    })
    test('should create a row given no data exists', () => {
      const row = createRowWithoutExtraTimestamp('ED123', '2024-02-15', 'event.external', {
        partitionKey: 'dog_ED123'
      })

      expect(row).toEqual({
        rowKey: '2024-02-15',
        category: 'event.external',
        partitionKey: 'dog_ED123',
        data: undefined
      })
    })
  })
})
