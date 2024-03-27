
const pseudonyms = [
  {
    data: JSON.stringify({
      username: 'internal-user',
      pseudonym: 'Hal'
    })
  },
  {
    data: JSON.stringify({
      username: 'martin-smith',
      pseudonym: 'Joe'
    })
  },
  {
    data: JSON.stringify({
      username: 'jane-doe',
      pseudonym: 'John'
    })
  },
  {
    data: JSON.stringify({
      username: 'phil-jones',
      pseudonym: 'Martin'
    })
  }
]

const pseudonymsAsyncIterator = (async function * () {
  yield pseudonyms[0]
  yield pseudonyms[1]
  yield pseudonyms[2]
  yield pseudonyms[3]
})()

module.exports = {
  pseudonymsAsyncIterator
}
