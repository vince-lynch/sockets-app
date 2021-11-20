const search = (searchTerm) => (wsSearch) =>
  wsSearch(searchTerm).then((results) =>
    results.map((result) => process.stdout.write(result))
  )

module.exports = search
