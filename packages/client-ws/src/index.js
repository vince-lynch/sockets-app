const { program } = require('commander')
const { io } = require('socket.io-client')
const fs = require('fs')

const { ws } = require('./datasources/ws/index.js')

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

program.version(packageJson.version)

const {
  WS_SERVER_URL = 'localhost',
  WS_SERVER_PORT = '3000',
  WS_SERVER_PROTOCOL = 'http'
} = process.env

const wsOperations = async () =>
  ws(io, WS_SERVER_PROTOCOL, WS_SERVER_URL, parseInt(WS_SERVER_PORT, 10))

program
  .command('search [query]')
  .description('searches Star Wars by character name')
  .action(async (query) => {
    const { query: q } = await wsOperations()
    const results = await q.search(query)
    results.forEach((result) => process.stdout.write(result))
    process.exit(0)
  })

program.parse(process.argv)
