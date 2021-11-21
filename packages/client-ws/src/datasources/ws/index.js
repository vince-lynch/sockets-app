const { commands } = require('./comms/index.js')

/**
 *
 * @param {*} io
 * @param {string} protocol
 * @param {string} host
 * @param {string} port
 */
const connect = (io) => async (protocol, host, port) =>
  io(`${protocol}://${host}:${port}`)

const onConnected = (conn, onConnectCb) =>
  new Promise((resolve) =>
    conn.on('connect', () => {
      process.stderr.write('\n-- client connected\n')
      onConnectCb()
      return resolve(conn)
    })
  )

const reconnect = (conn) => {
  process.stderr.write('\n-- client disconnected\n')
  return conn.connect()
}

const onConnectionError = (conn) =>
  conn.on('connect_error', () => reconnect(conn))

const onDisconnected = (conn) => conn.on('disconnect', () => reconnect(conn))

const ws = async (io, protocol, host, port, onConnectCb) =>
  connect(io)(protocol, host, port)
    .then((connection) =>
      Promise.all([connection, onConnectionError(connection)])
    )
    .then(([connection]) =>
      Promise.all([connection, onDisconnected(connection)])
    )
    .then(([connection]) =>
      Promise.all([connection, onConnected(connection, onConnectCb)])
    )
    .then(([connection]) => commands(connection))
    .then((c) => c.query.search)

module.exports = {
  ws
}
