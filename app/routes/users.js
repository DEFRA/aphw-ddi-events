const { getPseudonyms, addUser, removeUser } = require('../repos/pseudonyms')
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
        const messageArray = []

        if (e.message.toLowerCase().includes('username')) {
          messageArray.push('Username already exists.')
        }

        if (e.message.toLowerCase().includes('pseudonym')) {
          messageArray.push('Pseudonym already exists.')
        }

        const message = messageArray.join(' ')
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
