export interface Customer {
  id: string
  name: string | null
  email: string | null
}

export interface AIAssistant {
  id: string
  name: string | null
}

export interface Conversation {
  id: string
  created_at: string
  customer: Customer | null
  agent: AIAssistant | null
  status: string | null
  title?: string
}
