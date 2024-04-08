const { getCallingUser, isUserValid } = require('../../../app/auth/get-user')
const MOCK_USERNAME = 'mock-username'
const MOCK_DISPLAYNAME = 'mock-displayname'
let request

describe('auth getCallingUser', () => {
  test('should return username and displayname', () => {
    request = {
      headers: {
        'ddi-username': MOCK_USERNAME,
        'ddi-displayname': MOCK_DISPLAYNAME
      }
    }

    const result = getCallingUser(request)

    expect(result.username).toBe(MOCK_USERNAME)
    expect(result.displayname).toBe(MOCK_DISPLAYNAME)
  })

  test('should return blank username and blank displayname if headers are missing', () => {
    request = {
      headers: {
      }
    }

    const result = getCallingUser(request)

    expect(result.username).toBe('')
    expect(result.displayname).toBe('')
  })
})

describe('auth isUserValid', () => {
  test('should return false when missing username', () => {
    const user = {
      displayname: MOCK_DISPLAYNAME
    }

    const result = isUserValid(user)
    expect(result).toBeFalsy()
  })

  test('should return false when missing displayname', () => {
    const user = {
      username: MOCK_USERNAME
    }

    const result = isUserValid(user)
    expect(result).toBeFalsy()
  })

  test('should return false when blank username', () => {
    const user = {
      username: '',
      displayname: MOCK_DISPLAYNAME
    }

    const result = isUserValid(user)
    expect(result).toBeFalsy()
  })

  test('should return false when blank displayname', () => {
    const user = {
      username: MOCK_USERNAME,
      displayname: ''
    }

    const result = isUserValid(user)
    expect(result).toBeFalsy()
  })

  test('should return true when both username and displayname are present', () => {
    const user = {
      username: MOCK_USERNAME,
      displayname: MOCK_DISPLAYNAME
    }

    const result = isUserValid(user)
    expect(result).toBeTruthy()
  })
})
