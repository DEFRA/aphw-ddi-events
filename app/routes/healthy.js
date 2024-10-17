module.exports = {
  method: 'GET',
  path: '/healthy',
  options: {
    auth: false
  },
  handler: async (request, h) => {
    return h.response('ok').code(200)
  }
}
