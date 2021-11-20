const search =
  (searchTerm) =>
  ({ query: q }) =>
    q
      .search(searchTerm)
      .then((results) => {
        results.forEach((result) => process.stdout.write(result))
        return process.exit(0)
      })
      .catch((err) => {
        process.stderr.write(err)
        return process.exit(1)
      })

module.exports = search
