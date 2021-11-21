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

const onConnected = (conn) =>
  new Promise((resolve) => conn.on('connect', () => resolve(conn)))

const reconnect = (conn) => conn.connect()

const onConnectionError = (conn) =>
  conn.on('connect_error', () => {
    //process.stderr.write('\nConnection error\n')
    return reconnect(conn)
  })

const onDisconnected = (conn) =>
  conn.on('disconnect', () => {
    //process.stderr.write('\nDisconnected from websocket server\n')
    return reconnect(conn)
  })

const ws = async (io, protocol, host, port) =>
  connect(io)(protocol, host, port)
    .then((connection) =>
      Promise.all([connection, onConnectionError(connection)])
    )
    .then(([connection]) =>
      Promise.all([connection, onDisconnected(connection)])
    )
    .then(([connection]) => Promise.all([connection, onConnected(connection)]))
    .then(([connection]) => commands(connection))
    .then((c) => c.query.search)

module.exports = {
  ws
}
