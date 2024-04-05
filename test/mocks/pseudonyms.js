
const pseudonyms = [
  {
    rowKey: '100',
    data: JSON.stringify({
      username: 'internal-user',
      pseudonym: 'Hal'
    })
  },
  {
    rowKey: '101',
    data: JSON.stringify({
      username: 'martin-smith',
      pseudonym: 'Joe'
    })
  },
  {
    rowKey: '102',
    data: JSON.stringify({
      username: 'jane-doe',
      pseudonym: 'John'
    })
  },
  {
    rowKey: '103',
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
