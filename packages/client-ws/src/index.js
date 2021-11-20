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

const wsCommands = async () =>
  ws(io, WS_SERVER_PROTOCOL, WS_SERVER_URL, parseInt(WS_SERVER_PORT, 10))

program
  .command('search [query]')
  .description('searches Star Wars by character name')
  .action(async (query) => {
    const wsSearch = await search(wsCommands)
    wsSearch(query)
  })

program.parse(process.argv)
