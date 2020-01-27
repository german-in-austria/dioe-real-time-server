
export type TranscriptAction = [ string, any ]

interface TranscriptActions {
  [ transcript_id: number ]: TranscriptAction
}

const transcriptActions: TranscriptActions = {}

export default transcriptActions
