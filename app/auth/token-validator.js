const { scopes } = require('../constants/auth')
const { authConfig } = require('../config')

const returnVal = (
  isValid,
  {
    username = null,
    displayname = null,
    scope = []
  } = {}) => {
  return {
    isValid,
    credentials: {
      id: username,
      user: username,
      displayname: displayname ?? username,
      scope
    }
  }
}

const validatePortal = (_username, payload) => {
  return returnVal(true, payload)
}

const validateEnforcement = async (username, payload) => {
  const { token } = payload

  if (!token) {
    return returnVal(false)
  }

  // Should only permit valid email domains
  if (!authConfig.permittedDomains.split(',').some(permittedDomain => username.includes(permittedDomain))) {
    return returnVal(false)
  }

  // Police service should not be able to add internal scopes
  if (scopes.internal.some(allowedScope => payload.scope?.includes(allowedScope))) {
    return returnVal(false)
  }

  return returnVal(true, payload)
}

const validate = async (artifacts, _request, _h) => {
  const decoded = artifacts.decoded
  const payload = decoded.payload
  const username = payload.username

  if (!scopes.all.some(allowedScope => payload.scope?.includes(allowedScope))) {
    return returnVal(false)
  }

  if (!username) {
    return returnVal(false)
  }

  switch (payload.iss) {
    case 'aphw-ddi-portal': {
      return validatePortal(username, payload)
    }
    case 'aphw-ddi-enforcement': {
      return validateEnforcement(username, payload)
    }
  }

  return returnVal(false)
}

module.exports = {
  validate
}
