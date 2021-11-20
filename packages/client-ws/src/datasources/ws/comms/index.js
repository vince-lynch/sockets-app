const query = require('./query.js')

const commands = (wsConn) => ({
  query: query(wsConn)
})

module.exports = {
  commands
}
