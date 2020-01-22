type AppName = 'transcribe'|'anno'

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
