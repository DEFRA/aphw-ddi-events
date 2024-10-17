const scopes = {
  admin: 'Dog.Index.Admin',
  standard: 'Dog.Index.Standard',
  enforcement: 'Dog.Index.Enforcement',
  internal: ['Dog.Index.Admin', 'Dog.Index.Standard'],
  all: ['Dog.Index.Admin', 'Dog.Index.Standard', 'Dog.Index.Enforcement']
}

const issuers = {
  enforcement: 'aphw-ddi-enforcement',
  portal: 'aphw-ddi-portal'
}

module.exports = {
  issuers,
  scopes
}
