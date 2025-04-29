'use client'

import { useState } from 'react'
import { ExperienceAIAssistant } from '@/components/experiences/experience-ai-assistant'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface AIAssistantToggleProps {
  experienceData: {
    name: string
    description: string
    category: string
    location: string
    duration_minutes: number
    price_per_person: number
    highlights: string[]
    included: string[]
    not_included: string[]
  }
  onApplyDescription: (description: string) => void
  onApplyTags: (tags: string[]) => void
  onApplyHighlights: (highlights: string[]) => void
}

export function AIAssistantToggle({
  experienceData,
  onApplyDescription,
  onApplyTags,
  onApplyHighlights
}: AIAssistantToggleProps) {
  const [showAssistant, setShowAssistant] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button 
          variant={showAssistant ? "default" : "outline"} 
          size="sm"
          onClick={() => setShowAssistant(!showAssistant)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {showAssistant ? 'Hide Digital Assistant' : 'Show Digital Assistant'}
        </Button>
      </div>

      {showAssistant && (
        <ExperienceAIAssistant
          experienceData={experienceData}
          onApplyDescription={onApplyDescription}
          onApplyTags={onApplyTags}
          onApplyHighlights={onApplyHighlights}
        />
      )}
    </div>
  )
}
