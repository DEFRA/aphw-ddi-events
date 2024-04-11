
const pseudonyms = [
  {
    rowKey: '102',
    timestamp: '2024-04-11T08:00:43.8103903Z',
    data: JSON.stringify({
      username: 'jane-doe',
      pseudonym: 'John'
    })
  },
  {
    rowKey: '101',
    timestamp: '2024-04-11T08:00:43.8624424Z',
    data: JSON.stringify({
      username: 'martin-smith',
      pseudonym: 'Joe'
    })
  },
  {
    rowKey: '103',
    timestamp: '2024-04-11T07:49:17.6672581Z',
    data: JSON.stringify({
      username: 'Phil-Jones',
      pseudonym: 'martin'
    })
  },
  {
    rowKey: '100',
    timestamp: '2024-04-11T08:01:24.8314117Z',
    data: JSON.stringify({
      username: 'internal-user',
      pseudonym: 'Hal'
    })
  }
]

const pseudonymsAsyncIterator = (async function * () {
  yield pseudonyms[0]
  yield pseudonyms[1]
  yield pseudonyms[2]
  yield pseudonyms[3]
})()

const getMockPseudonymsAsyncIterator = () => {
  return (async function * () {
    yield pseudonyms[0]
    yield pseudonyms[1]
    yield pseudonyms[2]
    yield pseudonyms[3]
  })()
}

module.exports = {
  pseudonymsAsyncIterator,
  getMockPseudonymsAsyncIterator
}
