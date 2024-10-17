describe('token-validator', () => {
  describe('validate', () => {
    const token = 'abcdefgh123456'

    const { validate } = require('../../../app/auth/token-validator')

    afterEach(() => {
      jest.resetAllMocks()
    })

    test('should not validate if a user is missing token', async () => {
      const validation = await validate({ decoded: { payload: { username: 'bob@builder.com' } } })
      expect(validation).toEqual({ isValid: false, credentials: { id: null, user: null, displayname: null, scope: [] } })
    })

    describe('aphw-ddi-portal', () => {
      test('should successfully validate with aphw-ddi-portal call', async () => {
        const artifacts = {
          decoded: {
            payload: {
              username: 'william.shakespeare@theglobe.co.uk',
              displayname: 'William Shakespeare',
              exp: expect.any(Number),
              iat: expect.any(Number),
              scope: ['Dog.Index.Admin'],
              iss: 'aphw-ddi-portal'
            }
          }
        }

        const value = await validate(artifacts)

        expect(value).toEqual({
          isValid: true,
          credentials: {
            id: 'william.shakespeare@theglobe.co.uk',
            user: 'william.shakespeare@theglobe.co.uk',
            displayname: 'William Shakespeare',
            scope: ['Dog.Index.Admin']
          }
        })
      })

      test('should fail validation if no username exists', async () => {
        const artifacts = {
          decoded: {
            payload: {
              exp: expect.any(Number),
              iat: expect.any(Number),
              scope: ['Dog.Index.Admin'],
              iss: 'aphw-ddi-portal'
            }
          }
        }

        const value = await validate(artifacts)

        expect(value).toEqual({
          isValid: false,
          credentials: {
            id: null,
            user: null,
            displayname: null,
            scope: []
          }
        })
      })
    })

    describe('aphw-ddi-enforcement', () => {
      const username = 'chuck@norris.test.com'
      const artifacts = {
        decoded: {
          payload: {
            username,
            displayname: username,
            exp: expect.any(Number),
            iat: expect.any(Number),
            token,
            scope: ['Dog.Index.Enforcement'],
            iss: 'aphw-ddi-enforcement'
          }
        }
      }

      const makeArtifacts = (username, scope) => ({
        decoded: {
          payload: {
            ...artifacts.decoded.payload,
            username,
            displayname: username,
            scope: scope ?? artifacts.decoded.payload.scope
          }
        }
      })

      test('should validate if user is from a valid domain', async () => {
        const artifacts = makeArtifacts(username)

        const validation = await validate(artifacts)

        expect(validation).toEqual({
          isValid: true,
          credentials: {
            id: 'chuck@norris.test.com',
            user: 'chuck@norris.test.com',
            displayname: 'chuck@norris.test.com',
            scope: ['Dog.Index.Enforcement']
          }
        })
      })

      test('should not validate if user is not from a valid domain', async () => {
        const username = 'user@invalid.com'
        const artifacts = makeArtifacts(username)

        const validation = await validate(artifacts)

        expect(validation).toEqual({
          isValid: false,
          credentials: {
            displayname: null,
            id: null,
            scope: [],
            user: null
          }
        })
      })

      test('should not validate with aphw-ddi-enforcement call if user has unauthorised scopes', async () => {
        const validation = await validate(makeArtifacts('chuck@norris.test.com', ['Dog.Index.Admin']))
        expect(validation).toEqual({
          isValid: false,
          credentials: {
            displayname: null,
            id: null,
            scope: [],
            user: null
          }
        })
      })

      test('should not validate if token is missing', async () => {
        const username = 'unauthorised.user@example.com'
        const artifacts = makeArtifacts(username)
        artifacts.decoded.payload.token = null

        const validation = await validate(artifacts)

        expect(validation).toEqual({
          isValid: false,
          credentials: {
            displayname: null,
            id: null,
            scope: [],
            user: null
          }
        })
      })

      test('should not validate if a user is missing username', async () => {
        const invalidArtifacts = {
          decoded: {
            payload: {
              exp: expect.any(Number),
              iat: expect.any(Number),
              token,
              scope: ['Dog.Index.Enforcement'],
              iss: 'aphw-ddi-enforcement'
            }
          }
        }
        const validation = await validate(invalidArtifacts, {}, undefined, 'ABCDEF')
        expect(validation).toEqual({ isValid: false, credentials: { id: null, user: null, displayname: null, scope: [] } })
      })
    })
  })
})
