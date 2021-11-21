const search = (searchTerm) => (wsSearch) => {
  console.log('searchTerm', searchTerm)
  console.log('wsSearch', wsSearch)
  return wsSearch(searchTerm)
    .then((results) =>
      results.map((result) => process.stdout.write(`${result}\n`))
    )
    .finally(() =>
      process.stdout.write('\nWhat character would you like to search for? ')
    )
}

module.exports = search
