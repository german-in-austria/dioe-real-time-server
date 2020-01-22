
import { getLockedTranscripts } from './transcript'
import connections from './connections'
import { Message, MessageWithUser, ClientMessage, AppName } from './messages.d'

export function sendMessage(sock: SocketIO.Socket, m: Message) {
  return sock.send('message', m)
}

export function emitMessage(server: SocketIO.Server, m: MessageWithUser) {
  return server.emit('message', m)
}

export function emitToAllButSelf(socket: SocketIO.Socket, m: MessageWithUser) {
  return Object.values(socket.server.sockets.sockets).forEach((s) => {
    if (s.id !== socket.id) {
      s.send(m)
    }
  })
}

export function sendToUserId(userId: number, socket: SocketIO.Socket, m: Message) {
  const userSocket = Object.values(connections).find(c => c.user_id === userId)
  const s = socket.server.sockets.sockets
}

export default function handleClientMessage(m: ClientMessage, socket: SocketIO.Socket) {
  if (m.type === 'open_transcript') {
    // store
    connections[socket.id].transcript_id = m.transcript_id
    emitToAllButSelf(socket, {
      type: 'open_transcript',
      app: m.app,
      transcript_id: m.transcript_id,
      user: connections[socket.id]
    })
    emitMessage(socket.server, {
      type: 'list_open_transcripts',
      transcripts: getLockedTranscripts(connections),
      user: connections[socket.id]
    })
  } else if (m.type === 'transcript_operation') {
    emitToAllButSelf(socket, {
      type: 'transcript_operation',
      app: m.app,
      operation: m.operation,
      transcript_id: m.transcript_id,
      user: connections[socket.id]
    })
  } else if (m.type === 'close_transcript') {
    connections[socket.id].transcript_id = null
    emitToAllButSelf(socket, {
      type: 'close_transcript',
      app: m.app,
      user: connections[socket.id],
      transcript_id: m.transcript_id
    })
    emitMessage(socket.server, {
      type: 'list_open_transcripts',
      transcripts: getLockedTranscripts(connections),
      user: connections[socket.id]
    })
  }
  // else if (m.type === 'scroll_to') {
  //   sendToUserId(connections[socket.id], socket, {
  //     type: 'scroll_to',
  //     event_id: m.event_id
  //   })
  // }
  console.log(connections)
}
