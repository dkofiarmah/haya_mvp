"use client"

import * as React from "react"
import { Card, CardContent, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { AIPreferences, AssistantPreferences } from "../types"
import { Icons } from "../icons"
import { cn } from "@/lib/utils"

interface AIConfigurationStepProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AIPreferences
  assistantData: AssistantPreferences
  onUpdateAction: (data: AIPreferences, assistantData: AssistantPreferences) => void
  onNextAction: () => void
  onBackAction: () => void
}

const AI_ASSISTANTS = [
  {
    id: "discovery" as keyof AssistantPreferences,
    name: "Discovery Assistant",
    description: "Qualifies leads and recommends experiences",
    icon: Icons.search
  },
  {
    id: "itinerary" as keyof AssistantPreferences,
    name: "Itinerary Assistant",
    description: "Creates personalized travel itineraries",
    icon: Icons.calendar
  },
  {
    id: "concierge" as keyof AssistantPreferences,
    name: "Concierge Assistant",
    description: "Handles customer inquiries and support",
    icon: Icons.headset
  },
  {
    id: "bookingAssistant" as keyof AssistantPreferences,
    name: "Booking Assistant",
    description: "Manages reservations and confirmations",
    icon: Icons.checkCircle
  },
  {
    id: "customerSupport" as keyof AssistantPreferences,
    name: "Support Assistant",
    description: "Provides 24/7 customer assistance",
    icon: Icons.helping
  },
  {
    id: "marketingAssistant" as keyof AssistantPreferences,
    name: "Marketing Assistant",
    description: "Creates and manages marketing campaigns",
    icon: Icons.megaphone
  },
  {
    id: "notifications" as keyof AssistantPreferences,
    name: "Auto-Notifications",
    description: "Sends automated updates and reminders",
    icon: Icons.bell
  }
]

export const AIConfigurationStep = React.forwardRef<HTMLDivElement, AIConfigurationStepProps>(
  ({ data, assistantData, onUpdateAction, onNextAction, onBackAction, className, ...props }, ref) => {
    const updateAssistant = (id: keyof AssistantPreferences, value: boolean) => {
      const newAssistantData = { ...assistantData, [id]: value }
      onUpdateAction(data, newAssistantData)
    }

    return (
      <div ref={ref} className={cn("space-y-6", className)} {...props}>
        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-4">
              <Label>Communication Style</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={data.communicationStyle === "professional" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, communicationStyle: "professional" }, assistantData)}
                >
                  Professional
                </Button>
                <Button
                  variant={data.communicationStyle === "casual" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, communicationStyle: "casual" }, assistantData)}
                >
                  Casual
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Response Length</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={data.responseLength === "concise" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, responseLength: "concise" }, assistantData)}
                >
                  Concise
                </Button>
                <Button
                  variant={data.responseLength === "balanced" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, responseLength: "balanced" }, assistantData)}
                >
                  Balanced
                </Button>
                <Button
                  variant={data.responseLength === "detailed" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, responseLength: "detailed" }, assistantData)}
                >
                  Detailed
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Automation Level</Label>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={data.automationLevel === "minimal" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, automationLevel: "minimal" }, assistantData)}
                >
                  Minimal
                </Button>
                <Button
                  variant={data.automationLevel === "balanced" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, automationLevel: "balanced" }, assistantData)}
                >
                  Balanced
                </Button>
                <Button
                  variant={data.automationLevel === "full" ? "default" : "outline"}
                  onClick={() => onUpdateAction({ ...data, automationLevel: "full" }, assistantData)}
                >
                  Full
                </Button>
              </div>
              <CardDescription className="text-xs">
                Minimal: AI suggests actions for your approval
                <br />
                Balanced: AI handles routine tasks automatically
                <br />
                Full: AI manages most interactions independently
              </CardDescription>
            </div>

            <div className="space-y-4">
              <Label>Enable AI Assistants</Label>
              <div className="space-y-4">
                {AI_ASSISTANTS.map(({ id, name, description, icon: Icon }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-0.5">
                        <Label>{name}</Label>
                        <CardDescription>{description}</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={assistantData[id]}
                      onCheckedChange={(checked) => updateAssistant(id, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={onBackAction}>
                <Icons.arrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={onNextAction}>
                Next <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
)

AIConfigurationStep.displayName = "AIConfigurationStep"
