import * as socketIo from 'socket.io'
import * as util from 'util'
import axios from 'axios'

const websocket = socketIo({
  origins: [
    'http://localhost:8080',
    'https://transcribe.dioe.at'
  ],
  path: '/updates'
})


websocket.on('connect', async (sock) => {
  console.log('a user connected')
  console.log(sock.handshake.headers.cookie)
  const x = await axios({
    method: 'GET',
    url: 'https://dioedb.dioe.at/routes/auth',
    headers: {
      'Cookie': sock.handshake.headers.cookie
    }
  })
  console.log('req data', x.data)
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
