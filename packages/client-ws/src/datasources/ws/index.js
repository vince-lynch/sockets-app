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

const onDisconnected = (conn) =>
  conn.on('disconnect', () => {
    throw new Error('Disconnected from websocket server')
  })

const ws = async (io, protocol, host, port) =>
  connect(io)(protocol, host, port)
    .then((connection) => Promise.all([connection, onConnected(connection)]))
    .then(([connection]) =>
      Promise.all([connection, onDisconnected(connection)])
    )
    .then(([connection]) => commands(connection))
    .then((c) => c.query.search)

module.exports = {
  ws
}
