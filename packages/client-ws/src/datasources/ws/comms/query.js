const message = {
  query: 'l'
}

const hasFinishedPagination = (page, resultCount) => page === resultCount

const search = (conn) => (query) =>
  new Promise((resolve) => {
    const totalData = []

    conn.emit('search', { ...message, query })

    conn.on('search', ({ films, name, page, resultCount }) => {
      totalData.push(`${name} - ${films.toString()}`)
      if (hasFinishedPagination(page, resultCount)) {
        resolve(totalData)
      }
    })
  })

module.exports = (conn) => ({
  search: search(conn)
})
