
import { AppName, getLockedTranscripts } from './transcript'
import connections from './connections'

interface MessageBase {}

interface MessageUserDisconnected {
  type: 'user_disconnected'
}

interface MessageUserConnected {
  type: 'user_connected'
}

interface MessageCloseTranscript {
  type: 'close_transcript'
  transcript_id: number
  app: AppName
}

interface MessageOpenTranscript {
  type: 'open_transcript'
  transcript_id: number
  app: AppName
}

interface MessageTranscriptOperation {
  type: 'transcript_operation'
  app: AppName
  transcript_id: number
  operation: any
}

interface MessageListTranscripts {
  type: 'list_open_transcripts'
  transcripts: Array<{ transcript_id: number, app: AppName, user: { user_id: number, name: string } }>
}

interface MessageListUsers {
  type: 'list_connected_users',
  users: Array<{ user_id: number, name: string, transcript_id: number|null }>
}

type Message = MessageBase & (
  MessageOpenTranscript
 |MessageTranscriptOperation
 |MessageCloseTranscript
 |MessageUserConnected
 |MessageUserDisconnected
 |MessageListTranscripts
 |MessageListUsers
)

export type ClientMessage = Message & {
  app: AppName
  transcript_id: number
}

type MessageWithUser = Message & {
  user: {
    user_id: number
    name: string
  }
}

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
