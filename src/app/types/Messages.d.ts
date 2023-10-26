export interface Summary {
  date: string
  summary: string
  parsedDate: Date
}

export interface MessageSummary {
  lastDate: string
  summaries: Summary[]
}

export interface AIMessage {
  role: 'user' | 'system'
  content: string
}
