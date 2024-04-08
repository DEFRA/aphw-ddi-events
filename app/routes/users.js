const { getPseudonyms, addUser, removeUser, addUserPreflightCheck } = require('../repos/pseudonyms')
const { ResourceNotFoundError } = require('../errors/resourceNotFound')
const { DuplicateResourceError } = require('../errors/duplicateResourceError')

module.exports = [{
  method: 'GET',
  path: '/users',
  handler: async (request, h) => {
    const users = await getPseudonyms()

    return h.response({
      users
    }).code(200)
  }
},
{
  method: 'POST',
  path: '/users',
  handler: async (request, h) => {
    if (!request.payload?.username || !request.payload?.pseudonym) {
      return h.response().code(400)
    }

    try {
      const result = await addUser(request.payload)

      return h.response(result).code(200)
    } catch (e) {
      if (e instanceof DuplicateResourceError) {
        const message = e.message.includes('Resource already found with pseudonym') ? 'Pseudonym already exists' : 'Username already exists'
        return h.response({
          error: message,
          message,
          statusCode: 409
        }).code(409)
      }
      throw e
    }
  }
},
{
  method: 'OPTIONS',
  path: '/users',
  handler: async (request, h) => {
    if (!request.payload?.username || !request.payload?.pseudonym) {
      return h.response().code(400)
    }

    try {
      await addUserPreflightCheck(request.payload)

      return h.response().code(200)
    } catch (e) {
      if (e instanceof DuplicateResourceError) {
        return h.response({
          error: 'Username already exists',
          message: 'Username already exists',
          statusCode: 409
        }).code(409)
      }
      throw e
    }
  }
},
{
  method: 'DELETE',
  path: '/users/{username}',
  handler: async (request, h) => {
    try {
      await removeUser(request.params.username)
    } catch (e) {
      if (e instanceof ResourceNotFoundError) {
        return h.response(e.message).code(404)
      }
      throw e
    }

    return h.response().code(204)
  }
}]
