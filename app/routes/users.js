const { getPseudonyms, addUser, removeUser } = require('../repos/pseudonyms')

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
    if (!request.params.username) {
      return h.response().code(400)
    }

    const result = await removeUser(request.params.username)

    return h.response(result).code(200)
  }
}]
