"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronRight, ChevronLeft, Bot, MessageSquare, Info } from "lucide-react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

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

interface AIConfigurationStepProps {
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
}

const LANGUAGE_OPTIONS = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Japanese", value: "jp" },
  { label: "Chinese (Simplified)", value: "zh" },
  { label: "Portuguese", value: "pt" },
  { label: "Arabic", value: "ar" },
  { label: "Russian", value: "ru" }
]

export function AIConfigurationStep({
  data,
  onUpdateAction,
  onNextAction,
  onBackAction
}: AIConfigurationStepProps) {
  const [formState, setFormState] = useState({
    aiPreferences: data.aiPreferences,
    assistantPreferences: data.assistantPreferences
  })
  
  const handleSubmit = () => {
    onUpdateAction(formState)
    onNextAction()
  }

  const handleAIPreferenceChange = (field: keyof AIPreferences, value: any) => {
    setFormState(prev => ({
      ...prev,
      aiPreferences: {
        ...prev.aiPreferences,
        [field]: value
      }
    }))
  }

  const handleAssistantToggle = (field: keyof AssistantPreferences, value: boolean) => {
    setFormState(prev => ({
      ...prev,
      assistantPreferences: {
        ...prev.assistantPreferences,
        [field]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Configuration</h2>
        <p className="text-muted-foreground mt-2">
          Customize how HAYA's AI assistants work for your business
        </p>
      </div>

      <Tabs defaultValue="assistants" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assistants">AI Assistants</TabsTrigger>
          <TabsTrigger value="preferences">AI Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="assistants" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-blue-500" /> 
                    Discovery Assistant
                  </CardTitle>
                  <Switch
                    checked={formState.assistantPreferences.discovery}
                    onCheckedChange={(checked) => handleAssistantToggle("discovery", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Helps customers discover and explore your tour offerings through conversational Q&A
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-emerald-500" /> 
                    Itinerary Planner
                  </CardTitle>
                  <Switch
                    checked={formState.assistantPreferences.itinerary}
                    onCheckedChange={(checked) => handleAssistantToggle("itinerary", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Creates personalized tour itineraries based on customer preferences
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-amber-500" /> 
                    Concierge Assistant
                  </CardTitle>
                  <Switch
                    checked={formState.assistantPreferences.concierge}
                    onCheckedChange={(checked) => handleAssistantToggle("concierge", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Provides local recommendations and answers questions during tours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-indigo-500" /> 
                    Booking Assistant
                  </CardTitle>
                  <Switch
                    checked={formState.assistantPreferences.bookingAssistant}
                    onCheckedChange={(checked) => handleAssistantToggle("bookingAssistant", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Guides customers through the booking process and answers related questions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-purple-500" /> 
                    Customer Support
                  </CardTitle>
                  <Switch
                    checked={formState.assistantPreferences.customerSupport}
                    onCheckedChange={(checked) => handleAssistantToggle("customerSupport", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Handles common customer inquiries and support requests automatically
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-rose-500" /> 
                    Notifications Assistant
                  </CardTitle>
                  <Switch
                    checked={formState.assistantPreferences.notifications}
                    onCheckedChange={(checked) => handleAssistantToggle("notifications", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Sends intelligent, personalized notifications and reminders to customers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-cyan-500" /> 
                    Marketing Assistant
                  </CardTitle>
                  <Switch
                    checked={formState.assistantPreferences.marketingAssistant}
                    onCheckedChange={(checked) => handleAssistantToggle("marketingAssistant", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Helps create marketing content and personalized offers for your tours
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Communication Style</CardTitle>
                <CardDescription>
                  How would you like the AI to communicate with your customers?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formState.aiPreferences.communicationStyle} 
                  onValueChange={(value: "casual" | "professional" | "friendly") => 
                    handleAIPreferenceChange("communicationStyle", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="casual" id="style-casual" />
                    <Label htmlFor="style-casual" className="font-normal cursor-pointer">
                      <div className="font-medium">Casual</div>
                      <div className="text-sm text-muted-foreground">Relaxed, conversational tone</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="professional" id="style-professional" />
                    <Label htmlFor="style-professional" className="font-normal cursor-pointer">
                      <div className="font-medium">Professional</div>
                      <div className="text-sm text-muted-foreground">Formal, business-like tone</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friendly" id="style-friendly" />
                    <Label htmlFor="style-friendly" className="font-normal cursor-pointer">
                      <div className="font-medium">Friendly</div>
                      <div className="text-sm text-muted-foreground">Warm, approachable tone</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Length</CardTitle>
                <CardDescription>
                  How detailed should the AI responses be?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formState.aiPreferences.responseLength} 
                  onValueChange={(value: "concise" | "balanced" | "detailed") => 
                    handleAIPreferenceChange("responseLength", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="concise" id="length-concise" />
                    <Label htmlFor="length-concise" className="font-normal cursor-pointer">
                      <div className="font-medium">Concise</div>
                      <div className="text-sm text-muted-foreground">Brief, to-the-point responses</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="length-balanced" />
                    <Label htmlFor="length-balanced" className="font-normal cursor-pointer">
                      <div className="font-medium">Balanced</div>
                      <div className="text-sm text-muted-foreground">Moderate detail and length</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="detailed" id="length-detailed" />
                    <Label htmlFor="length-detailed" className="font-normal cursor-pointer">
                      <div className="font-medium">Detailed</div>
                      <div className="text-sm text-muted-foreground">Comprehensive, informative responses</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Language Preference</CardTitle>
                <CardDescription>
                  Primary language for AI communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Select
                  value={formState.aiPreferences.languagePreference}
                  onValueChange={(value) => handleAIPreferenceChange("languagePreference", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: AI can still understand and respond in multiple languages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Level</CardTitle>
                <CardDescription>
                  How much would you like to automate with AI?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={formState.aiPreferences.automationLevel} 
                  onValueChange={(value: "minimal" | "balanced" | "extensive") => 
                    handleAIPreferenceChange("automationLevel", value)
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="minimal" id="auto-minimal" />
                    <Label htmlFor="auto-minimal" className="font-normal cursor-pointer">
                      <div className="font-medium">Minimal</div>
                      <div className="text-sm text-muted-foreground">Human approval for most actions</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="balanced" id="auto-balanced" />
                    <Label htmlFor="auto-balanced" className="font-normal cursor-pointer">
                      <div className="font-medium">Balanced</div>
                      <div className="text-sm text-muted-foreground">AI handles routine tasks, humans handle complex ones</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="extensive" id="auto-extensive" />
                    <Label htmlFor="auto-extensive" className="font-normal cursor-pointer">
                      <div className="font-medium">Extensive</div>
                      <div className="text-sm text-muted-foreground">AI handles most customer interactions</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Proactive Engagement</CardTitle>
                    <CardDescription>
                      Allow AI to initiate conversations with customers at appropriate times
                    </CardDescription>
                  </div>
                  <Switch
                    checked={formState.aiPreferences.proactiveEngagement}
                    onCheckedChange={(checked) => handleAIPreferenceChange("proactiveEngagement", checked)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  When enabled, AI can start conversations for booking reminders, follow-ups, 
                  recommendations, and other helpful interactions.
                </p>
              </CardContent>
              <CardFooter className="bg-muted/50 border-t">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Info className="h-3 w-3 mr-1" />
                  You can customize specific proactive scenarios in the dashboard after setup
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4 flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBackAction}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        
        <Button 
          type="button" 
          onClick={handleSubmit}
          className="flex items-center"
        >
          Next Step <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
