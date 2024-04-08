const getCallingUser = (request) => {
  console.log('headers', request?.headers)
  return {
    username: request?.headers?.['ddi-username'] ?? '',
    displayname: request?.headers?.['ddi-displayname'] ?? ''
  }
}

const isUserValid = (user) => {
  return user?.username && user?.username !== '' && user?.displayname && user?.displayname !== ''
}

module.exports = {
  getCallingUser,
  isUserValid
}
