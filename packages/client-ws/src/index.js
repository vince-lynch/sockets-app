const debounce = require('debounce')
const readline = require('readline')
const { io } = require('socket.io-client')

const search = require('./commands/search.js')
const { ws } = require('./datasources/ws/index.js')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const {
  WS_SERVER_URL = 'localhost',
  WS_SERVER_PORT = '3000',
  WS_SERVER_PROTOCOL = 'http'
} = process.env

const onConnected = () => {
  process.stdout.write('What character would you like to search for? ')
}

const wsCommands = ws(
  io,
  WS_SERVER_PROTOCOL,
  WS_SERVER_URL,
  parseInt(WS_SERVER_PORT, 10),
  debounce(onConnected, 2.5 * 1000)
)

const action = (query) =>
  wsCommands.then(search(query)).catch((err) => {
    process.stderr.write(`${err}\n`)
  })

rl.on('line', action)
