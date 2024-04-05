const { getPseudonyms, addUser, removeUser } = require('../repos/pseudonyms')
const { ResourceNotFoundError } = require('../errors/resourceNotFound')

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
    const result = await addUser(request.payload)

    return h.response(result).code(200)
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