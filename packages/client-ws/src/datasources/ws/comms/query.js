const message = {
  query: 'l'
}

const mapWsStarWarsResToString = (page, resultCount, films, name) =>
  `(${page}/${resultCount}) ${name} - [${films.toString()}]`

const hasFinishedPagination = (page, resultCount) => page === resultCount

const onResult =
  (resolve, reject, totalData = []) =>
  ({ error, films, name, page, resultCount }) => {
    if (error) return reject(error)

    totalData.push(mapWsStarWarsResToString(page, resultCount, films, name))

    if (hasFinishedPagination(page, resultCount)) return resolve(totalData)

    return totalData
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
