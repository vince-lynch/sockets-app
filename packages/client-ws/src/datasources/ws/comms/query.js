const message = {
  query: 'l'
}

const mapWsStarWarsResToString = (films, name) =>
  `${name} - ${films.toString()}`

const hasFinishedPagination = (page, resultCount) => page === resultCount

const onResult =
  (resolve, reject, totalData = []) =>
  ({ error, films, name, page, resultCount }) => {
    if (error) {
      reject(error)
    } else {
      totalData.push(mapWsStarWarsResToString(films, name))
      if (hasFinishedPagination(page, resultCount)) {
        resolve(totalData)
      }
    }
  }

const search = (conn) => (query) =>
  new Promise((resolve, reject) =>
    conn.emit('search', { ...message, query })
      ? conn.on('search', onResult(resolve, reject))
      : new Error('not connected')
  )

module.exports = (conn) => ({
  search: search(conn)
})
