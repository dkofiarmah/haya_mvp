'use client'

import { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Lightbulb, 
  Sparkles, 
  Tag, 
  Calendar, 
  MessageSquareText,
  Loader2
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { 
  generateExperienceDescription, 
  generateExperienceTags,
  suggestExperienceImprovements,
  generateAvailabilitySuggestions
} from '@/app/actions/ai-experience-assistant'
import { Badge } from '@/components/ui/badge'

interface ExperienceAIAssistantProps {
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

export function ExperienceAIAssistant({
  experienceData,
  onApplyDescription,
  onApplyTags,
  onApplyHighlights
}: ExperienceAIAssistantProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('content')
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const [isGeneratingImprovements, setIsGeneratingImprovements] = useState(false)
  const [isGeneratingAvailability, setIsGeneratingAvailability] = useState(false)
  
  const [generatedDescription, setGeneratedDescription] = useState('')
  const [generatedTags, setGeneratedTags] = useState<string[]>([])
  const [improvementSuggestions, setImprovementSuggestions] = useState<string[]>([])
  const [availabilitySuggestion, setAvailabilitySuggestion] = useState<any>(null)
  
  // Generate content using AI
  const handleGenerateDescription = async () => {
    if (!experienceData.name || !experienceData.category || !experienceData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in the experience name, category, and location first.",
        variant: "destructive"
      })
      return
    }
    
    setIsGeneratingDescription(true)
    
    try {
      const result = await generateExperienceDescription({
        name: experienceData.name,
        category: experienceData.category,
        location: experienceData.location,
        durationMinutes: experienceData.duration_minutes || 60,
        highlights: experienceData.highlights || []
      })
      
      if (result.success && result.description) {
        setGeneratedDescription(result.description)
        toast({
          title: "Description generated",
          description: "AI has generated a description for your experience."
        })
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "Failed to generate description.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error generating description:", error)
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingDescription(false)
    }
  }
  
  // Generate tags using AI
  const handleGenerateTags = async () => {
    if (!experienceData.name || !experienceData.description || !experienceData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in the experience name, description, and category first.",
        variant: "destructive"
      })
      return
    }
    
    setIsGeneratingTags(true)
    
    try {
      const result = await generateExperienceTags({
        name: experienceData.name,
        description: experienceData.description,
        category: experienceData.category,
        location: experienceData.location
      })
      
      if (result.success && result.tags) {
        setGeneratedTags(result.tags)
        toast({
          title: "Tags generated",
          description: "AI has generated tags for your experience."
        })
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "Failed to generate tags.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error generating tags:", error)
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingTags(false)
    }
  }
  
  // Generate improvement suggestions
  const handleGenerateImprovements = async () => {
    if (!experienceData.description) {
      toast({
        title: "Missing description",
        description: "Please add a description to get improvement suggestions.",
        variant: "destructive"
      })
      return
    }
    
    setIsGeneratingImprovements(true)
    
    try {
      const result = await suggestExperienceImprovements({
        name: experienceData.name,
        description: experienceData.description,
        category: experienceData.category,
        location: experienceData.location,
        pricingInfo: `$${experienceData.price_per_person}`,
        included: experienceData.included,
        notIncluded: experienceData.not_included
      })
      
      if (result.success && result.suggestions) {
        setImprovementSuggestions(result.suggestions)
        toast({
          title: "Suggestions ready",
          description: "AI has analyzed your description and provided suggestions."
        })
      } else {
        toast({
          title: "Analysis failed",
          description: result.error || "Failed to generate suggestions.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error generating improvements:", error)
      toast({
        title: "Analysis failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingImprovements(false)
    }
  }
  
  // Generate availability suggestions
  const handleGenerateAvailability = async () => {
    if (!experienceData.category || !experienceData.location) {
      toast({
        title: "Missing information",
        description: "Please fill in the experience category and location first.",
        variant: "destructive"
      })
      return
    }
    
    setIsGeneratingAvailability(true)
    
    try {
      const result = await generateAvailabilitySuggestions({
        category: experienceData.category,
        location: experienceData.location,
        durationMinutes: experienceData.duration_minutes || 60
      })
      
      if (result.success && result.availabilitySuggestion) {
        setAvailabilitySuggestion(result.availabilitySuggestion)
        toast({
          title: "Availability suggestions ready",
          description: "AI has suggested optimal availability for your experience."
        })
      } else {
        toast({
          title: "Generation failed",
          description: result.error || "Failed to generate availability suggestions.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error generating availability:", error)
      toast({
        title: "Generation failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      })
    } finally {
      setIsGeneratingAvailability(false)
    }
  }
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Digital Assistant
        </CardTitle>
        <CardDescription>
          Let AI help you create compelling and effective experience content
        </CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="content">
            <MessageSquareText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="tags">
            <Tag className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tags</span>
          </TabsTrigger>
          <TabsTrigger value="improvements">
            <Lightbulb className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Improvements</span>
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Availability</span>
          </TabsTrigger>
        </TabsList>
        
        <CardContent className="pt-6">
          <TabsContent value="content" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate a compelling description for your experience based on the details you've provided.
              </p>
              
              <Button 
                onClick={handleGenerateDescription}
                disabled={isGeneratingDescription}
                className="w-full sm:w-auto"
              >
                {isGeneratingDescription && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Description
              </Button>
              
              {generatedDescription && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-line">{generatedDescription}</p>
                  </div>
                  
                  <Button 
                    variant="secondary"
                    onClick={() => onApplyDescription(generatedDescription)}
                  >
                    Apply This Description
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tags" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Generate relevant tags for your experience to improve discoverability.
              </p>
              
              <Button 
                onClick={handleGenerateTags}
                disabled={isGeneratingTags}
                className="w-full sm:w-auto"
              >
                {isGeneratingTags && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Tags
              </Button>
              
              {generatedTags.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {generatedTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="secondary"
                    onClick={() => onApplyTags(generatedTags)}
                  >
                    Apply These Tags
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="improvements" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get suggestions to improve your experience description and details.
              </p>
              
              <Button 
                onClick={handleGenerateImprovements}
                disabled={isGeneratingImprovements}
                className="w-full sm:w-auto"
              >
                {isGeneratingImprovements && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Analyze & Suggest Improvements
              </Button>
              
              {improvementSuggestions.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="space-y-2">
                    {improvementSuggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 rounded-md bg-muted">
                        <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="availability" className="mt-0">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get AI-powered suggestions for optimal availability settings.
              </p>
              
              <Button 
                onClick={handleGenerateAvailability}
                disabled={isGeneratingAvailability}
                className="w-full sm:w-auto"
              >
                {isGeneratingAvailability && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Generate Availability Suggestions
              </Button>
              
              {availabilitySuggestion && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-muted rounded-md space-y-3">
                    <div>
                      <h4 className="text-sm font-medium">Recommended Seasons</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {availabilitySuggestion.recommendedSeasons.map((season: string, index: number) => (
                          <Badge key={index} variant="outline">{season}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Recommended Time Slots</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {availabilitySuggestion.recommendedTimeSlots.map((slot: string, index: number) => (
                          <Badge key={index} variant="outline">{slot}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium">Suggested Capacity</h4>
                      <p className="text-sm mt-1">
                        We recommend offering {availabilitySuggestion.suggestedTimeSlotsPerDay} time slot(s) per day 
                        with a maximum of {availabilitySuggestion.suggestedMaxBookingsPerSlot} booking(s) per slot.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Powered by AI to help you create better experiences
        </p>
      </CardFooter>
    </Card>
  )
}
