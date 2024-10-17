const { constructDateFilter, constructSearchFilter, constructUserFilter, constructDogFilter, constructOwnerFilter } = require('../../../app/repos/external-events-query-builder')

describe('ExternalEventsQueryBuilder', () => {
  describe('constructDateFilter', () => {
    test('returns correct query', () => {
      expect(constructDateFilter([], '2024-05-05', '2024-10-10')).toBe('PartitionKey eq \'date\' and RowKey gt \'2024-05-05\' and RowKey lt \'2024-10-10\'')
    })
  })

  describe('constructSearchFilter', () => {
    test('returns correct query when dates supplied', () => {
      const query = constructSearchFilter(['john', 'smith'], '2024-05-05', '2024-10-10')
      expect(query).toBe('PartitionKey eq \'search\' and ((RowKey ge \'john|2024-05-05\' and RowKey lt \'john|2024-10-11\') or (RowKey ge \'smith|2024-05-05\' and RowKey lt \'smith|2024-10-11\'))')
    })

    test('returns correct query when no dates', () => {
      const query = constructSearchFilter(['john', 'smith'])
      expect(query).toBe('PartitionKey eq \'search\' and ((RowKey ge \'john|\' and RowKey lt \'john}\') or (RowKey ge \'smith|\' and RowKey lt \'smith}\'))')
    })

    test('returns correct query when uppercase terms', () => {
      const query = constructSearchFilter(['JOHN', 'SMith'])
      expect(query).toBe('PartitionKey eq \'search\' and ((RowKey ge \'john|\' and RowKey lt \'john}\') or (RowKey ge \'smith|\' and RowKey lt \'smith}\'))')
    })
  })

  describe('constructUserFilter', () => {
    test('returns correct query when dates supplied', () => {
      const query = constructUserFilter('john@here.com', '2024-05-05', '2024-10-10')
      expect(query).toBe('PartitionKey eq \'user_john@here.com\' and RowKey gt \'2024-05-05\' and RowKey lt \'2024-10-10\'')
    })

    test('returns correct query when uppercase user', () => {
      const query = constructUserFilter('JOHN@HERE.COM', '2024-05-05', '2024-10-10')
      expect(query).toBe('PartitionKey eq \'user_john@here.com\' and RowKey gt \'2024-05-05\' and RowKey lt \'2024-10-10\'')
    })

    test('returns correct query when no dates', () => {
      const query = constructUserFilter('john@here.com')
      expect(query).toBe('PartitionKey eq \'user_john@here.com\'')
    })
  })

  describe('constructDogFilter', () => {
    test('returns correct query when dates supplied', () => {
      const query = constructDogFilter('ED1', '2024-05-05', '2024-10-10')
      expect(query).toBe('PartitionKey eq \'dog_ED1\' and RowKey gt \'2024-05-05\' and RowKey lt \'2024-10-10\'')
    })

    test('returns correct query when lowercase index number', () => {
      const query = constructDogFilter('ed1', '2024-05-05', '2024-10-10')
      expect(query).toBe('PartitionKey eq \'dog_ED1\' and RowKey gt \'2024-05-05\' and RowKey lt \'2024-10-10\'')
    })

    test('returns correct query when no dates', () => {
      const query = constructDogFilter('ED1')
      expect(query).toBe('PartitionKey eq \'dog_ED1\'')
    })
  })

  describe('constructOwnerFilter', () => {
    test('returns correct query when dates supplied', () => {
      const query = constructOwnerFilter('P-123-456', '2024-05-05', '2024-10-10')
      expect(query).toBe('PartitionKey eq \'owner_P-123-456\' and RowKey gt \'2024-05-05\' and RowKey lt \'2024-10-10\'')
    })

    test('returns correct query when lowercase reference', () => {
      const query = constructOwnerFilter('p-123-456', '2024-05-05', '2024-10-10')
      expect(query).toBe('PartitionKey eq \'owner_P-123-456\' and RowKey gt \'2024-05-05\' and RowKey lt \'2024-10-10\'')
    })

    test('returns correct query when no dates', () => {
      const query = constructOwnerFilter('P-123-456')
      expect(query).toBe('PartitionKey eq \'owner_P-123-456\'')
    })
  })
})
