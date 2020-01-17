import * as express from 'express'
import * as socketIo from 'socket.io'
import * as http from 'http'
import * as util from 'util'
import * as cors from 'cors'

const app = express()

app.set('port', 3000)

const corsOptions: cors.CorsOptions = {
  origin: [
    'http://localhost:8080',
    'https://transcribe.dioe.at'
  ],
  credentials: true
}

app.use(cors(corsOptions))

const server = new http.Server(app)
const websocket = socketIo(http, { origins: '*:*'})

app.get('/health-check', (req, res) => {
  res.send('OK!')
})

websocket.on('connect', (sock) => {
  console.log('a user connected')
  console.log(sock.handshake.headers)
  sock.send('hello!')
})

websocket.listen(server)

const s = server.listen(3000, function() {
  console.log('listening on *:3000')
})

websocket.listen(s)
