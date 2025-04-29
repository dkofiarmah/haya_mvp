import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ChannelConfiguration({ channelId }: { channelId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Settings</CardTitle>
          <CardDescription>Configure the basic settings for this communication channel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Channel Name</Label>
            <Input id="channel-name" defaultValue="WhatsApp" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel-description">Description</Label>
            <Textarea
              id="channel-description"
              defaultValue="WhatsApp Business API integration for instant messaging"
              className="min-h-20"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="channel-type">Channel Type</Label>
              <Select defaultValue="whatsapp">
                <SelectTrigger id="channel-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="instagram">Instagram DM</SelectItem>
                  <SelectItem value="twitter">Twitter DM</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="custom">Custom Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel-priority">Priority Level</Label>
              <Select defaultValue="high">
                <SelectTrigger id="channel-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-high">Very High</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="channel-active">Active Status</Label>
              <p className="text-sm text-muted-foreground">Enable or disable this channel</p>
            </div>
            <Switch id="channel-active" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>WhatsApp Business API Configuration</CardTitle>
          <CardDescription>Configure your WhatsApp Business API integration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp-phone">WhatsApp Business Phone Number</Label>
            <Input id="whatsapp-phone" defaultValue="+1 (555) 987-6543" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-display">Display Name</Label>
            <Input id="whatsapp-display" defaultValue="LuxTour Travel" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-id">Business Account ID</Label>
            <Input id="whatsapp-id" defaultValue="123456789012345" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-token">API Token</Label>
            <Input id="whatsapp-token" type="password" defaultValue="••••••••••••••••••••••••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp-webhook">Webhook URL</Label>
            <Input id="whatsapp-webhook" defaultValue="https://api.luxtour.com/webhooks/whatsapp" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Settings</CardTitle>
          <CardDescription>Configure how this channel responds to messages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Response</Label>
                <p className="text-sm text-muted-foreground">Automatically respond to incoming messages</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting-message">Greeting Message</Label>
              <Textarea
                id="greeting-message"
                defaultValue="Hello! Thank you for contacting LuxTour Travel. I'm your virtual travel assistant, ready to help you plan your perfect luxury vacation. How may I assist you today?"
                className="min-h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="away-message">Away Message</Label>
              <Textarea
                id="away-message"
                defaultValue="Thank you for your message. Our team is currently unavailable, but we'll respond to your inquiry as soon as possible. For urgent matters, please call our emergency line at +1 (555) 123-4567."
                className="min-h-20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Business Hours</Label>
            <div className="rounded-md border p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch id="hours-monday" defaultChecked />
                  <Label htmlFor="hours-monday">Monday: 9:00 AM - 6:00 PM</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="hours-tuesday" defaultChecked />
                  <Label htmlFor="hours-tuesday">Tuesday: 9:00 AM - 6:00 PM</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="hours-wednesday" defaultChecked />
                  <Label htmlFor="hours-wednesday">Wednesday: 9:00 AM - 6:00 PM</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="hours-thursday" defaultChecked />
                  <Label htmlFor="hours-thursday">Thursday: 9:00 AM - 6:00 PM</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="hours-friday" defaultChecked />
                  <Label htmlFor="hours-friday">Friday: 9:00 AM - 6:00 PM</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="hours-saturday" defaultChecked />
                  <Label htmlFor="hours-saturday">Saturday: 10:00 AM - 4:00 PM</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="hours-sunday" />
                  <Label htmlFor="hours-sunday">Sunday: Closed</Label>
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

      <Card>
        <CardHeader>
          <CardTitle>Human Intervention Settings</CardTitle>
          <CardDescription>Configure when to escalate conversations to human operators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Human Review</Label>
                <p className="text-sm text-muted-foreground">Set the level of human review required for this channel</p>
              </div>
              <Select defaultValue="optional">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="required">Always Required</SelectItem>
                  <SelectItem value="optional">Optional (AI decides)</SelectItem>
                  <SelectItem value="none">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Escalation Triggers</Label>
            <div className="rounded-md border p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Switch id="trigger-sentiment" defaultChecked />
                  <Label htmlFor="trigger-sentiment">Negative sentiment detected</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-complex" defaultChecked />
                  <Label htmlFor="trigger-complex">Complex or unusual requests</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-high-value" defaultChecked />
                  <Label htmlFor="trigger-high-value">High-value booking inquiries</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-repeat" defaultChecked />
                  <Label htmlFor="trigger-repeat">Repeated questions or confusion</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="trigger-explicit" defaultChecked />
                  <Label htmlFor="trigger-explicit">Explicit request for human agent</Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
