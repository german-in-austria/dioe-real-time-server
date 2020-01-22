import * as socketIo from 'socket.io'
import { getLockedTranscripts } from './service/transcript'
import connections from './service/connections'
import { getBackEndAuth } from './service/backend'
import handleClientMessage, { emitMessage, sendMessage, emitToAllButSelf } from './service/messages'

console.log(process.env.NODE_ENV)

const websocket = socketIo({
  origins: [
    'http://localhost:8080',
    'https://transcribe.dioe.at'
  ],
  path: '/updates'
})

websocket.on('connect', async (socket) => {
  const user = await getBackEndAuth(socket)
  if (user !== null) {
    connections[socket.id] = {
      app: 'transcribe',
      name: user.user_name,
      user_id: user.user_id,
      transcript_id: null
    }
    emitToAllButSelf(socket, {
      type: 'user_connected',
      user: connections[socket.id]
    })
    emitMessage(socket.server, {
      type: 'list_connected_users',
      user: connections[socket.id],
      users: Object.values(connections)
    })
    sendMessage(socket, {
      type: 'list_open_transcripts',
      transcripts: getLockedTranscripts(connections)
    })
    console.log(connections)
    socket.on('message', (m) => {
      handleClientMessage(m, socket)
    })
  }
  socket.on('disconnect', () => {
    if (connections[socket.id].transcript_id !== null) {
      emitMessage(websocket, {
        type: 'close_transcript',
        app: 'transcribe',
        user: connections[socket.id],
        transcript_id: connections[socket.id].transcript_id as number
      })
      emitMessage(socket.server, {
        type: 'list_open_transcripts',
        transcripts: getLockedTranscripts(connections),
        user: connections[socket.id]
      })
    }
    emitMessage(socket.server, {
      type: 'user_disconnected',
      user: connections[socket.id]
    })
    delete connections[socket.id]
    emitMessage(socket.server, {
      type: 'list_connected_users',
      user: connections[socket.id],
      users: Object.values(connections)
    })
    console.log(connections)
  })
})

websocket.listen(3000)
