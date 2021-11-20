const { commands } = require('./comms/index.js')

/**
 *
 * @param {*} io
 * @param {string} protocol
 * @param {string} host
 * @param {string} port
 */
const connect = (io) => (protocol, host, port) =>
  io(`${protocol}://${host}:${port}`)

const onConnected = (conn) =>
  new Promise((resolve) => conn.on('connect', () => resolve(conn)))

const ws = async (io, protocol, host, port) => {
  const configSocket = connect(io)
  const connection = await onConnected(configSocket(protocol, host, port))
  return commands(connection)
}

module.exports = {
  ws
}
