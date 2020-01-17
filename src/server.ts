import * as socketIo from 'socket.io'
import * as util from 'util'

const websocket = socketIo({
  origins: [
    'http://localhost:8080',
    'https://transcribe.dioe.at'
  ],
  path: '/updates'
})

websocket.on('connect', (sock) => {
  console.log('a user connected')
  console.log(sock.handshake.headers.cookie)
  sock.send('hello!')
  websocket.emit('USER_CONNECTED', {
    name: 'arni',
    id: 1
  })
  sock.on('disconnect', () => {
    console.log('disconnected!!')
  })
})

websocket.listen(3000)
