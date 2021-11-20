const s = (q) => (searchTerm) =>
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

const search = async (wsCommands) => {
  const { query } = await wsCommands()
  return s(query)
}

module.exports = search
