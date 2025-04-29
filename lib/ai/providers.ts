// Define the AI model providers and their models
const providers = [
  {
    id: "openai",
    name: "OpenAI",
    models: [
      { id: "gpt-4o", name: "GPT-4o" },
      { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
    ],
  },
  {
    id: "anthropic",
    name: "Anthropic",
    models: [
      { id: "claude-3-opus", name: "Claude 3 Opus" },
      { id: "claude-3-sonnet", name: "Claude 3 Sonnet" },
      { id: "claude-3-haiku", name: "Claude 3 Haiku" },
    ],
  },
  {
    id: "groq",
    name: "Groq",
    models: [
      { id: "llama3-70b-8192", name: "Llama 3 70B" },
      { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B" },
    ],
  },
]

// Get all available models with provider information
export function getProviderModels() {
  return providers.flatMap((provider) =>
    provider.models.map((model) => ({
      ...model,
      provider: provider.id,
      providerName: provider.name,
    })),
  )
}

// Get a specific model by ID
export function getModelById(modelId: string) {
  for (const provider of providers) {
    const model = provider.models.find((m) => m.id === modelId)
    if (model) {
      return {
        id: model.id,
        provider: provider.id,
      }
    }
  }
  return null
}

// Get a provider by ID
export function getProviderById(providerId: string) {
  return providers.find((p) => p.id === providerId)
}
