const { getPseudonymClient } = require('../storage')

const getPseudonyms = async () => {
  try {
    const client = getPseudonymClient()

    const entities = client.listEntities()

    const resultMap = new Map()

    for await (const entity of entities) {
      const [key, value] = mapEntity(entity)
      resultMap.set(key, value)
    }

    return resultMap
  } catch (err) {
    console.log('Error getting pseudonyms', err.message)
    throw err
  }
}

const mapEntity = (entity) => {
  const data = JSON.parse(entity.data)
  const { username, pseudonym } = data

  return [username, pseudonym]
}

module.exports = {
  getPseudonyms
}
