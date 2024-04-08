const { getPseudonyms, addUser, removeUser } = require('../repos/pseudonyms')
const { ResourceNotFoundError } = require('../errors/resourceNotFound')
const { DuplicateResourceError } = require('../errors/duplicateResourceError')
const { getCallingUser } = require('../auth/get-user')

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
      const result = await addUser(request.payload, getCallingUser(request))

      return h.response(result).code(200)
    } catch (e) {
      if (e instanceof DuplicateResourceError) {
        return h.response(e.message).code(409)
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
      await removeUser(request.params.username, getCallingUser(request))
    } catch (e) {
      if (e instanceof ResourceNotFoundError) {
        return h.response(e.message).code(404)
      }
      throw e
    }

    return h.response().code(204)
  }
}]
