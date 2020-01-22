import { AppName } from './transcript'

export interface Connections {
  [ connection_id: string ]: {
    app: AppName
    user_id: number
    name: string
    transcript_id: number|null
  }
}

const connections: Connections = {}

export default connections
