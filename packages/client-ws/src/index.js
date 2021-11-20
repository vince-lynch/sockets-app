const { io } = require('socket.io-client')

const socket = io('http://localhost:3000')

const message = {
  query: 'Luke'
}

socket.on('connect', () => {
  console.log(socket.id)

  socket.emit('search', message)

  socket.on('search', (data) => {
    console.log('data', data)
  })
})
