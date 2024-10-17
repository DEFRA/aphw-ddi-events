const Hapi = require('@hapi/hapi')
const config = require('./config/api')

async function createServer () {
  const server = Hapi.server({
    port: config.port,
    routes: {
      validate: {
        options: {
          abortEarly: false
        }
      }
    },
    router: {
      stripTrailingSlash: true
    }
  })

  await server.register(require('./plugins/auth'))
  await server.register(require('./plugins/router'))

  return server
}

module.exports = createServer
