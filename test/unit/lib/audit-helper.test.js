const { auditAdd, auditRemove } = require('../../../app/lib/audit-helper')

const validUser = {
  username: 'valid-user',
  displayname: 'Valid User'
}

jest.mock('../../../app/inbound/save-event/event')
const { saveEvent } = require('../../../app/inbound/save-event/event')
const { PSEUDONYM } = require('../../../app/constants/entity-names')

describe('Audit helper', () => {
  beforeEach(() => {
    saveEvent.mockResolvedValue()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('auditAdd should throw error when invalid entity', async () => {
    await expect(auditAdd('invalidEntity', {}, validUser)).rejects.toThrow('Invalid entity (invalidEntity) for admin auditing')
  })

  test('auditAdd should throw error when invalid calling user', async () => {
    await expect(auditAdd(PSEUDONYM, {}, {})).rejects.toThrow('Username and displayname are required for auditing event of entity pseudonym')
  })

  test('auditAdd should save event with correct structure', async () => {
    await auditAdd(PSEUDONYM, { username: 'username1', pseudonym: 'pseudonym1' }, validUser)
    expect(saveEvent).toHaveBeenCalledWith({
      partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
      subject: 'DDI Admin Add Pseudonym',
      data: '{"message":{"actioningUser":{"username":"valid-user","displayname":"Valid User"},"operation":"add pseudonym","added":{"username":"username1","pseudonym":"pseudonym1"}}}'
    })
  })

  test('auditRemove should throw error when invalid entity', async () => {
    await expect(auditRemove('invalidEntity', {}, validUser)).rejects.toThrow('Invalid entity (invalidEntity) for admin auditing')
  })

  test('auditRemove should throw error when invalid calling user', async () => {
    await expect(auditRemove(PSEUDONYM, {}, {})).rejects.toThrow('Username and displayname are required for auditing event of entity pseudonym')
  })

  test('auditRemove should save event with correct structure', async () => {
    await auditRemove(PSEUDONYM, { username: 'username2' }, validUser)
    expect(saveEvent).toHaveBeenCalledWith({
      partitionKey: 'uk.gov.defra.ddi.admin.pseudonym',
      subject: 'DDI Admin Remove Pseudonym',
      data: '{"message":{"actioningUser":{"username":"valid-user","displayname":"Valid User"},"operation":"remove pseudonym","removed":{"username":"username2"}}}'
    })
  })
})
