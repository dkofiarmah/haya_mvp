import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AgentConfiguration({ agentId }: { agentId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
          <CardDescription>Configure the basic settings for this AI agent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input id="agent-name" defaultValue="Discovery Agent" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent-description">Description</Label>
            <Textarea
              id="agent-description"
              defaultValue="Converses with users to understand their preferences and requirements for trips."
              className="min-h-20"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agent-model">AI Model</Label>
              <Select defaultValue="gpt-4o">
                <SelectTrigger id="agent-model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="custom">Custom Fine-tuned Model</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="agent-type">Agent Type</Label>
              <Select defaultValue="discovery">
                <SelectTrigger id="agent-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery</SelectItem>
                  <SelectItem value="itinerary">Itinerary Design</SelectItem>
                  <SelectItem value="booking">Booking & Logistics</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="feedback">Feedback & Review</SelectItem>
                  <SelectItem value="custom">Custom Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="agent-active">Active Status</Label>
              <p className="text-sm text-muted-foreground">Enable or disable this agent</p>
            </div>
            <Switch id="agent-active" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Behavior Settings</CardTitle>
          <CardDescription>Configure how this agent behaves and responds.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="personality" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="personality" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent-persona">Agent Persona</Label>
                <Textarea
                  id="agent-persona"
                  defaultValue="You are a friendly, knowledgeable travel consultant who specializes in luxury travel experiences. You're enthusiastic about helping clients discover their perfect trip, and you ask thoughtful questions to understand their preferences. You're patient, detail-oriented, and always maintain a warm, professional tone."
                  className="min-h-32"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Formality</Label>
                    <span className="text-sm text-muted-foreground">Professional</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} step={1} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Friendliness</Label>
                    <span className="text-sm text-muted-foreground">Warm</span>
                  </div>
                  <Slider defaultValue={[80]} max={100} step={1} />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Label>Detail Level</Label>
                    <span className="text-sm text-muted-foreground">Comprehensive</span>
                  </div>
                  <Slider defaultValue={[85]} max={100} step={1} />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="responses" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="greeting-message">Greeting Message</Label>
                <Textarea
                  id="greeting-message"
                  defaultValue="Hello! I'm your luxury travel consultant. I'm excited to help you plan an extraordinary journey tailored to your preferences. To get started, could you tell me a bit about what you're looking for in your next travel experience?"
                  className="min-h-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallback-message">Fallback Message</Label>
                <Textarea
                  id="fallback-message"
                  defaultValue="I apologize, but I'm not sure I fully understand what you're looking for. Could you please provide a bit more detail about your travel preferences or what specific information you need?"
                  className="min-h-20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="handoff-message">Human Handoff Message</Label>
                <Textarea
                  id="handoff-message"
                  defaultValue="Thank you for sharing those details. To ensure we create the perfect experience for you, I'd like to connect you with one of our human travel specialists who can provide personalized assistance. Would that be alright with you?"
                  className="min-h-20"
                />
              </div>
            </TabsContent>
            <TabsContent value="advanced" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <div className="flex items-center gap-2">
                    <Slider id="temperature" defaultValue={[0.7]} max={1} step={0.1} className="flex-1" />
                    <span className="w-12 text-center">0.7</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Controls randomness: Lower values are more deterministic, higher values more creative.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-tokens">Max Response Length</Label>
                  <div className="flex items-center gap-2">
                    <Slider id="max-tokens" defaultValue={[1024]} min={256} max={4096} step={128} className="flex-1" />
                    <span className="w-12 text-center">1024</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Maximum number of tokens in the response.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  defaultValue="You are an AI travel consultant for LuxTour, a luxury travel agency. Your role is to help clients discover their travel preferences and requirements. Ask thoughtful questions to understand their needs, including destination interests, travel dates, budget range, accommodation preferences, desired activities, and any special requirements. Maintain a warm, professional tone and focus on gathering comprehensive information to help create personalized travel experiences. If the client's request is unclear or lacks detail, ask clarifying questions. If the request requires human expertise or is outside your capabilities, offer to connect them with a human travel specialist."
                  className="min-h-40"
                />
                <p className="text-xs text-muted-foreground">
                  Advanced system prompt that defines the agent's core behavior and knowledge.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Human Intervention Settings</CardTitle>
          <CardDescription>Configure when this agent should escalate to a human operator.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Escalate on Low Confidence</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically escalate to a human when the agent has low confidence
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Confidence Threshold</Label>
                <span className="text-sm text-muted-foreground">70%</span>
              </div>
              <Slider defaultValue={[70]} max={100} step={1} />
              <p className="text-xs text-muted-foreground">
                Escalate to a human when confidence falls below this threshold.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Escalation Triggers</Label>
            <div className="rounded-md border p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch id="trigger-budget" defaultChecked />
                  <Label htmlFor="trigger-budget">High-value bookings (over $10,000)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-special" defaultChecked />
                  <Label htmlFor="trigger-special">Special requests or custom arrangements</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-complaint" defaultChecked />
                  <Label htmlFor="trigger-complaint">Customer complaints or dissatisfaction</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-urgent" defaultChecked />
                  <Label htmlFor="trigger-urgent">Urgent requests (within 48 hours)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-vip" defaultChecked />
                  <Label htmlFor="trigger-vip">VIP client interactions</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline">Reset to Default</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
