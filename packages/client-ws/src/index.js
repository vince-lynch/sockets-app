const { program } = require('commander')
const { io } = require('socket.io-client')
const fs = require('fs')

const search = require('./commands/search.js')
const { ws } = require('./datasources/ws/index.js')

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

program.version(packageJson.version)

const {
  WS_SERVER_URL = 'localhost',
  WS_SERVER_PORT = '3000',
  WS_SERVER_PROTOCOL = 'http'
} = process.env

const wsCommands = ws(
  io,
  WS_SERVER_PROTOCOL,
  WS_SERVER_URL,
  parseInt(WS_SERVER_PORT, 10)
)

const action = (query) =>
  wsCommands
    .then(search(query))
    .catch((err) => {
      process.stderr.write(err)
      process.exit(1)
    })
    .finally(() => process.exit(0))

program
  .command('search [query]')
  .description('searches Star Wars by character name')
  .action(action)

program.parse(process.argv)
