"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ArrowLeft, Bot, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface AIPreferences {
  communicationStyle: "casual" | "professional" | "friendly";
  responseLength: "concise" | "balanced" | "detailed";
  languagePreference: string;
  automationLevel: "minimal" | "balanced" | "extensive";
  customizationLevel: "low" | "moderate" | "high";
  proactiveEngagement: boolean;
}

interface AssistantPreferences {
  discovery: boolean;
  itinerary: boolean;
  concierge: boolean;
  notifications: boolean;
  bookingAssistant: boolean;
  customerSupport: boolean;
  marketingAssistant: boolean;
}

interface SimplifiedAIStepProps {
  data: {
    aiPreferences: AIPreferences;
    assistantPreferences: AssistantPreferences;
  };
  onUpdateAction: (data: {
    aiPreferences: AIPreferences;
    assistantPreferences: AssistantPreferences;
  }) => void;
  onNextAction: () => void;
  onBackAction: () => void;
  isSubmitting?: boolean;
}

const COMMUNICATION_STYLES = [
  { label: "Casual & Conversational", value: "casual" },
  { label: "Professional & Formal", value: "professional" },
  { label: "Friendly & Helpful", value: "friendly" }
]

const AUTOMATION_LEVELS = [
  { label: "Minimal - I prefer manual control", value: "minimal" },
  { label: "Balanced - Good mix of automation and control", value: "balanced" },
  { label: "Extensive - Automate as much as possible", value: "extensive" }
]

const ASSISTANT_TYPES = [
  { 
    id: "discovery", 
    label: "Discovery Assistant", 
    description: "Help clients discover new tour options"
  },
  { 
    id: "itinerary", 
    label: "Itinerary Builder", 
    description: "Create and manage tour itineraries"
  },
  { 
    id: "concierge", 
    label: "Concierge Service", 
    description: "Answer questions and provide recommendations"
  },
  { 
    id: "notifications", 
    label: "Notifications", 
    description: "Automated reminders and updates for clients"
  }
]

export function SimplifiedAIStep({
  data,
  onUpdateAction,
  onNextAction,
  onBackAction,
  isSubmitting = false
}: SimplifiedAIStepProps) {
  const [formState, setFormState] = useState({
    aiPreferences: data.aiPreferences,
    assistantPreferences: data.assistantPreferences
  });

  const updateAIPreference = (field: keyof AIPreferences, value: any) => {
    setFormState({
      ...formState,
      aiPreferences: {
        ...formState.aiPreferences,
        [field]: value
      }
    });
  };

  const updateAssistantPreference = (field: keyof AssistantPreferences, value: boolean) => {
    setFormState({
      ...formState,
      assistantPreferences: {
        ...formState.assistantPreferences,
        [field]: value
      }
    });
  };

  const handleSubmit = () => {
    onUpdateAction(formState);
    onNextAction();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" /> 
            AI Preferences
          </CardTitle>
          <CardDescription>
            Customize how our AI assistants work for your business
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Communication Style */}
          <div className="space-y-2">
            <Label htmlFor="communication-style" className="font-medium">
              Communication Style
            </Label>
            <Select
              value={formState.aiPreferences.communicationStyle}
              onValueChange={(value: "casual" | "professional" | "friendly") => 
                updateAIPreference('communicationStyle', value)
              }
            >
              <SelectTrigger id="communication-style">
                <SelectValue placeholder="Select communication style" />
              </SelectTrigger>
              <SelectContent>
                {COMMUNICATION_STYLES.map((style) => (
                  <SelectItem key={style.value} value={style.value}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Automation Level */}
          <div className="space-y-2">
            <Label htmlFor="automation-level" className="font-medium">
              Automation Level
            </Label>
            <Select
              value={formState.aiPreferences.automationLevel}
              onValueChange={(value: "minimal" | "balanced" | "extensive") => 
                updateAIPreference('automationLevel', value)
              }
            >
              <SelectTrigger id="automation-level">
                <SelectValue placeholder="Select automation level" />
              </SelectTrigger>
              <SelectContent>
                {AUTOMATION_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* AI Assistants */}
          <div className="space-y-4">
            <Label className="font-medium">
              Enable AI Assistants
            </Label>
            
            <div className="space-y-4">
              {ASSISTANT_TYPES.map((assistant) => (
                <div key={assistant.id} className="flex justify-between items-start space-x-3">
                  <div>
                    <Label htmlFor={`assistant-${assistant.id}`} className="font-medium">
                      {assistant.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {assistant.description}
                    </p>
                  </div>
                  <Switch
                    id={`assistant-${assistant.id}`}
                    checked={formState.assistantPreferences[assistant.id as keyof AssistantPreferences]}
                    onCheckedChange={(checked) => 
                      updateAssistantPreference(assistant.id as keyof AssistantPreferences, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBackAction}
          className="space-x-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        
        <Button 
          onClick={handleSubmit}
          className="space-x-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Complete Setup</span>
          )}
        </Button>
      </div>
    </div>
  )
}
