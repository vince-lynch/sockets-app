const query = require('./query.js')

const operations = (wsConn) => ({
  query: query(wsConn)
})

module.exports = {
  operations
}
