import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Mail, MessageCircle, MessageSquare, Phone, Instagram, Twitter, PlusCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AgentChannels({ agentId }: { agentId: string }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Connected Channels</h3>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Connect Channel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="text-base">Email</CardTitle>
              </div>
              <Switch checked={true} />
            </div>
            <CardDescription>Primary email channel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Response Priority</Label>
                <Badge variant="outline">High</Badge>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Auto-Response</Label>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Human Review</Label>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  Optional
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Response Templates</Label>
              <Select defaultValue="discovery">
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery Questions</SelectItem>
                  <SelectItem value="followup">Follow-up Messages</SelectItem>
                  <SelectItem value="confirmation">Confirmation Emails</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full">
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                </div>
                <CardTitle className="text-base">WhatsApp</CardTitle>
              </div>
              <Switch checked={true} />
            </div>
            <CardDescription>WhatsApp Business API</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Response Priority</Label>
                <Badge variant="outline">Very High</Badge>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Auto-Response</Label>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Human Review</Label>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  Optional
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Response Templates</Label>
              <Select defaultValue="discovery">
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery Questions</SelectItem>
                  <SelectItem value="followup">Follow-up Messages</SelectItem>
                  <SelectItem value="confirmation">Confirmation Messages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full">
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                  <Instagram className="h-4 w-4 text-purple-500" />
                </div>
                <CardTitle className="text-base">Instagram DM</CardTitle>
              </div>
              <Switch checked={false} />
            </div>
            <CardDescription>Instagram direct messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Response Priority</Label>
                <Badge variant="outline">Medium</Badge>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Auto-Response</Label>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                  Disabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Human Review</Label>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                  Required
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Response Templates</Label>
              <Select defaultValue="discovery" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery Questions</SelectItem>
                  <SelectItem value="followup">Follow-up Messages</SelectItem>
                  <SelectItem value="confirmation">Confirmation Messages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10">
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                </div>
                <CardTitle className="text-base">SMS</CardTitle>
              </div>
              <Switch checked={true} />
            </div>
            <CardDescription>Text messaging service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Response Priority</Label>
                <Badge variant="outline">High</Badge>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Auto-Response</Label>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Human Review</Label>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                  Optional
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Response Templates</Label>
              <Select defaultValue="brief">
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief Responses</SelectItem>
                  <SelectItem value="followup">Follow-up Messages</SelectItem>
                  <SelectItem value="confirmation">Confirmation SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full">
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/10">
                  <Twitter className="h-4 w-4 text-sky-500" />
                </div>
                <CardTitle className="text-base">Twitter DM</CardTitle>
              </div>
              <Switch checked={false} />
            </div>
            <CardDescription>Twitter direct messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Response Priority</Label>
                <Badge variant="outline">Medium</Badge>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Auto-Response</Label>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                  Disabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Human Review</Label>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                  Required
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Response Templates</Label>
              <Select defaultValue="discovery" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discovery">Discovery Questions</SelectItem>
                  <SelectItem value="followup">Follow-up Messages</SelectItem>
                  <SelectItem value="confirmation">Confirmation Messages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Configure
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10">
                  <Phone className="h-4 w-4 text-red-500" />
                </div>
                <CardTitle className="text-base">Phone</CardTitle>
              </div>
              <Switch checked={false} />
            </div>
            <CardDescription>Voice call integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Response Priority</Label>
                <Badge variant="outline">Very High</Badge>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium">Auto-Response</Label>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                  Disabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Human Review</Label>
                <Badge variant="outline" className="bg-gray-500/10 text-gray-500">
                  Required
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Voice Templates</Label>
              <Select defaultValue="greeting" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greeting">Greeting Script</SelectItem>
                  <SelectItem value="discovery">Discovery Questions</SelectItem>
                  <SelectItem value="handoff">Human Handoff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Channel Routing Rules</CardTitle>
          <CardDescription>Configure how messages are routed between channels.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium">Cross-Channel Conversation</h4>
                <p className="text-sm text-muted-foreground">
                  Allow this agent to continue conversations across different channels
                </p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch id="rule-1" checked={true} />
                <Label htmlFor="rule-1">Follow up on email inquiries via WhatsApp if phone number is available</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="rule-2" checked={true} />
                <Label htmlFor="rule-2">Send booking confirmations to all available channels</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="rule-3" checked={false} />
                <Label htmlFor="rule-3">Automatically escalate to phone call for urgent inquiries or issues</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="rule-4" checked={true} />
                <Label htmlFor="rule-4">Use client's preferred channel for all communications when specified</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
