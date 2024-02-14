const routes = [].concat(
  require('../routes/events.js'),
  require('../routes/healthy.js'),
  require('../routes/healthz.js')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
