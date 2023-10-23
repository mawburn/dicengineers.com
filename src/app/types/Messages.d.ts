export interface Summary {
  date: string
  summary: string
}

export interface MessageSummary {
  lastDate: string
  summaries: Summary[]
}

export interface AIMessage {
  role: 'user' | 'system'
  content: string
}
