const routes = [].concat(
  require('../routes/events.js'),
  require('../routes/external-events.js'),
  require('../routes/healthy.js'),
  require('../routes/healthz.js'),
  require('../routes/users.js')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
