import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Pencil, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export function ChannelTemplates({ channelId }: { channelId: string }) {
  // Dummy variables to satisfy the linter. In a real application, these would be populated from a data source.
  const client_name = "Client Name"
  const time_of_day = "Morning"
  const agent_name = "Agent Name"
  const company_name = "Company Name"
  const business_hours = "9 AM - 5 PM"
  const emergency_number = "+1 (555) 123-4567"
  const previous_destinations = "Paris, Rome"
  const destination = "Hawaii"
  const days_since_contact = "3"
  const start_date = "2024-01-15"
  const end_date = "2024-01-22"
  const accommodation_name = "Luxury Suite"
  const check_in_date = "2024-01-15"
  const check_out_date = "2024-01-22"
  const guest_count = "2"
  const booking_reference = "REF12345"
  const offer_details = "20% off on all excursions"
  const expiration_date = "2024-02-29"
  const discount_percentage = "20%"
  const estimated_wait_time = "5 minutes"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Response Templates</h3>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <Tabs defaultValue="greeting" className="space-y-4">
        <TabsList>
          <TabsTrigger value="greeting">Greeting</TabsTrigger>
          <TabsTrigger value="discovery">Discovery</TabsTrigger>
          <TabsTrigger value="followup">Follow-up</TabsTrigger>
          <TabsTrigger value="confirmation">Confirmation</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        <TabsContent value="greeting" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Initial Greeting</CardTitle>
                  <CardDescription>Sent when a client initiates a conversation.</CardDescription>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="greeting-template">Template Content</Label>
                <Textarea
                  id="greeting-template"
                  className="min-h-32"
                  defaultValue="Hello! Thank you for contacting LuxTour Travel. I'm your virtual travel assistant, ready to help you plan your perfect luxury vacation. How may I assist you today?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="greeting-variables">Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{{ client_name }}</Badge>
                  <Badge variant="outline">{{ time_of_day }}</Badge>
                  <Badge variant="outline">{{ agent_name }}</Badge>
                  <Badge variant="outline">{{ company_name }}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>After Hours Greeting</CardTitle>
                  <CardDescription>Sent when a client messages outside business hours.</CardDescription>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="after-hours-template">Template Content</Label>
                <Textarea
                  id="after-hours-template"
                  className="min-h-32"
                  defaultValue="Hello! Thank you for contacting LuxTour Travel. Our team is currently away, but we've received your message and will respond as soon as we're back in the office. Our business hours are Monday to Friday, 9 AM to 6 PM, and Saturday, 10 AM to 4 PM (Eastern Time). For urgent matters, please call our emergency line at +1 (555) 123-4567."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="after-hours-variables">Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{{ client_name }}</Badge>
                  <Badge variant="outline">{{ business_hours }}</Badge>
                  <Badge variant="outline">{{ emergency_number }}</Badge>
                  <Badge variant="outline">{{ company_name }}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="discovery" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Preference Discovery</CardTitle>
                  <CardDescription>Used to gather client travel preferences.</CardDescription>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preference-template">Template Content</Label>
                <Textarea
                  id="preference-template"
                  className="min-h-32"
                  defaultValue="To help create the perfect travel experience for you, I'd like to understand your preferences better. Could you please share some details about:

1. Your preferred travel dates
2. Approximate budget range
3. Preferred destinations or types of experiences (beach, cultural, adventure, etc.)
4. Accommodation preferences (luxury hotel, private villa, etc.)
5. Any special requirements or interests

This information will help me tailor recommendations specifically for you."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preference-variables">Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{{ client_name }}</Badge>
                  <Badge variant="outline">{{ previous_destinations }}</Badge>
                  <Badge variant="outline">{{ agent_name }}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="followup" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Follow-up Message</CardTitle>
                  <CardDescription>Sent to follow up on previous conversations.</CardDescription>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="followup-template">Template Content</Label>
                <Textarea
                  id="followup-template"
                  className="min-h-32"
                  defaultValue="Hello {{client_name}}, I hope you're doing well. I'm following up on our previous conversation about your travel plans to {{destination}}. Have you had a chance to review the information I sent? I'm happy to answer any questions or provide additional details to help with your decision."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="followup-variables">Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{{ client_name }}</Badge>
                  <Badge variant="outline">{{ destination }}</Badge>
                  <Badge variant="outline">{{ days_since_contact }}</Badge>
                  <Badge variant="outline">{{ agent_name }}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="confirmation" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Booking Confirmation</CardTitle>
                  <CardDescription>Sent when a booking is confirmed.</CardDescription>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="confirmation-template">Template Content</Label>
                <Textarea
                  id="confirmation-template"
                  className="min-h-32"
                  defaultValue="Great news, {{client_name}}! Your booking for {{destination}} from {{start_date}} to {{end_date}} has been confirmed. 

Here's a summary of your booking:
- Accommodation: {{accommodation_name}}
- Check-in: {{check_in_date}}
- Check-out: {{check_out_date}}
- Number of guests: {{guest_count}}

You'll receive a detailed itinerary and all necessary documents via email shortly. If you have any questions or need to make changes, please don't hesitate to contact us.

Thank you for choosing LuxTour Travel for your luxury vacation!"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmation-variables">Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{{ client_name }}</Badge>
                  <Badge variant="outline">{{ destination }}</Badge>
                  <Badge variant="outline">{{ start_date }}</Badge>
                  <Badge variant="outline">{{ end_date }}</Badge>
                  <Badge variant="outline">{{ accommodation_name }}</Badge>
                  <Badge variant="outline">{{ check_in_date }}</Badge>
                  <Badge variant="outline">{{ check_out_date }}</Badge>
                  <Badge variant="outline">{{ guest_count }}</Badge>
                  <Badge variant="outline">{{ booking_reference }}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Human Handoff</CardTitle>
                  <CardDescription>Used when transferring to a human agent.</CardDescription>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="handoff-template">Template Content</Label>
                <Textarea
                  id="handoff-template"
                  className="min-h-32"
                  defaultValue="Thank you for your patience, {{client_name}}. To ensure you receive the best possible assistance with your luxury travel plans, I'm connecting you with one of our human travel specialists who can provide personalized guidance. {{agent_name}} will be with you shortly. In the meantime, is there anything else you'd like me to note for them about your travel preferences?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="handoff-variables">Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{{ client_name }}</Badge>
                  <Badge variant="outline">{{ agent_name }}</Badge>
                  <Badge variant="outline">{{ estimated_wait_time }}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Special Offer</CardTitle>
                  <CardDescription>Used to send special offers to clients.</CardDescription>
                </div>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="offer-template">Template Content</Label>
                <Textarea
                  id="offer-template"
                  className="min-h-32"
                  defaultValue="Hello {{client_name}}, 

I thought you might be interested in this exclusive offer we have for {{destination}}, which aligns with your travel preferences. For a limited time, we're offering:

{{offer_details}}

This offer is available until {{expiration_date}}. Would you like more information about this opportunity?"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="offer-variables">Available Variables</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{{ client_name }}</Badge>
                  <Badge variant="outline">{{ destination }}</Badge>
                  <Badge variant="outline">{{ offer_details }}</Badge>
                  <Badge variant="outline">{{ expiration_date }}</Badge>
                  <Badge variant="outline">{{ discount_percentage }}</Badge>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Create New Template</CardTitle>
          <CardDescription>Create a custom response template for this channel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-template-name">Template Name</Label>
            <Input id="new-template-name" placeholder="Enter template name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-template-category">Category</Label>
            <Input id="new-template-category" placeholder="Enter category" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-template-content">Template Content</Label>
            <Textarea id="new-template-content" className="min-h-32" placeholder="Enter template content" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Create Template</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
