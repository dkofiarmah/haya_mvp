export interface BaseModel {
  id: string
  name: string
  provider: string
  providerName: string
  contextWindow: number
  streaming: boolean
}

export interface AIAgent {
  id: string
  name: string
  description: string
  model_id: string
  provider_id: string
  system_prompt: string
  temperature: number
  max_tokens: number
  status: "active" | "inactive" | "training"
  role: string
  created_at: string
  updated_at: string
  knowledge_base_ids: string[]
}

export interface AIAgentInput {
  name: string
  description: string
  model_id: string
  provider_id: string
  system_prompt: string
  temperature: number
  max_tokens: number
  status: "active" | "inactive" | "training"
  role: string
  knowledge_base_ids: string[]
}

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: "document" | "database" | "website" | "qa_pairs"
  created_at: string
  updated_at: string
  status: "active" | "processing" | "error"
  source_url?: string
  file_path?: string
  content?: string
}

export interface KnowledgeBaseInput {
  name: string
  description: string
  type: "document" | "database" | "website" | "qa_pairs"
  status: "active" | "processing" | "error"
  source_url?: string
  file_path?: string
  content?: string
}

export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  created_at: string
  conversation_id: string
  agent_id?: string
}

export interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
  customer_id?: string
  agent_id?: string
  channel_id?: string
  tour_id?: string
}
