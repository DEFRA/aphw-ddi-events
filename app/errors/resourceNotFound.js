function ResourceNotFoundError (message) {
  this.name = 'ResourceNotFoundError'
  this.message = message
  this.stack = (new Error()).stack
}
ResourceNotFoundError.prototype = Object.create(Error.prototype)
ResourceNotFoundError.prototype.name = 'ResourceNotFoundError'

module.exports = { ResourceNotFoundError }
