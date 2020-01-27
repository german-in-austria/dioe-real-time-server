import { TranscriptAction } from './operations'

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

interface MessageTranscriptAction {
  type: 'transcript_action'
  app: AppName
  transcript_id: number
  action: TranscriptAction
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
 |MessageTranscriptAction
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
