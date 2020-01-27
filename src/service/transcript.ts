import { AppName } from './messages.d'
import { Connections } from './connections'

interface LockedTranscript {
  transcript_id: number
  app: AppName
  user: {
      name: string
      user_id: number
  }
}

export function getOpenTranscripts(cs: Connections): LockedTranscript[] {
  return Object.values(cs)
    .filter(c => c.transcript_id !== null)
    .map(c => {
      return {
        transcript_id: c.transcript_id as number,
        app: c.app,
        user: {
          name: c.name,
          user_id: c.user_id
        }
      }
    })
}
