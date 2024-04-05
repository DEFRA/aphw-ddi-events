function DuplicateResourceError (message) {
  this.name = 'DuplicateResourceError'
  this.message = message
  this.stack = (new Error()).stack
}
DuplicateResourceError.prototype = Object.create(Error.prototype)
DuplicateResourceError.prototype.name = 'DuplicateResourceError'

module.exports = { DuplicateResourceError }
