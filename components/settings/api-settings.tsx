import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, Key, RefreshCw } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export function ApiSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for external integrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">Production API Key</h3>
                <p className="text-sm text-muted-foreground">Use this key for your production environment.</p>
              </div>
              <Badge className="w-fit bg-green-500/10 text-green-500">Active</Badge>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="password"
                  value="sk_live_51NZgLpKLj8ijKZh9Ue7dFcXfMZxFN5JwlBJn"
                  readOnly
                  className="pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Created on Oct 15, 2024</span>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-3 w-3" />
                Rotate Key
              </Button>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium">Test API Key</h3>
                <p className="text-sm text-muted-foreground">Use this key for testing and development.</p>
              </div>
              <Badge className="w-fit bg-amber-500/10 text-amber-500">Test</Badge>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="password"
                  value="sk_test_51NZgLpKLj8ijKZh9Ue7dFcXfMZxFN5JwlBJn"
                  readOnly
                  className="pr-10"
                />
                <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Created on Oct 15, 2024</span>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-3 w-3" />
                Rotate Key
              </Button>
            </div>
          </div>

          <Button>
            <Key className="mr-2 h-4 w-4" />
            Generate New API Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>External Integrations</CardTitle>
          <CardDescription>Connect with third-party services and APIs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="connected" className="space-y-4">
            <TabsList>
              <TabsTrigger value="connected">Connected</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
            </TabsList>
            <TabsContent value="connected" className="space-y-4">
              <div className="rounded-lg border">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <path d="M3.1 7.9 9 6.1l5.9 1.9 5.9-1.9" />
                        <path d="M3.1 12 9 10.2l5.9 1.8 5.9-1.8" />
                        <path d="M3.1 16.1 9 14.3l5.9 1.8 5.9-1.8" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Stripe</h3>
                      <p className="text-sm text-muted-foreground">Payment processing</p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stripe-key" className="text-sm">
                        API Key
                      </Label>
                      <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                        <EyeOff className="h-3 w-3" />
                        Hide
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input id="stripe-key" value="sk_live_51NZgLpKLj8ijKZh9Ue7dFcXfMZxFN5JwlBJn" readOnly />
                      <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                    <Button size="sm">Configure</Button>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-500"
                      >
                        <path d="M22 7.7c0 2.4-1.7 5.1-5 5.1-3.4 0-5-2.7-5-5.1 0-2.3 1.7-5.1 5-5.1s5 2.8 5 5.1Z" />
                        <path d="M7 12.8c-3.4 0-5-2.7-5-5.1C2 5.4 3.7 2.6 7 2.6c1.5 0 2.7.6 3.5 1.5" />
                        <path d="M22 13.9v3.6c0 2.4-1.7 4.1-5 4.1-1.6 0-2.8-.5-3.5-1.3" />
                        <path d="M7 21.6c-3.3 0-5-1.7-5-4.1V7.7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Twilio</h3>
                      <p className="text-sm text-muted-foreground">SMS and WhatsApp messaging</p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    <Label htmlFor="twilio-sid" className="text-sm">
                      Account SID
                    </Label>
                    <Input id="twilio-sid" value="AC9e7a7c8d6b5f4e3d2c1b0a9f8e7d6c5" readOnly />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                    <Button size="sm">Configure</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="available" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">LinkedIn</h3>
                      <p className="text-sm text-muted-foreground">Social media integration</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" variant="outline">
                      Connect
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-purple-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-500"
                      >
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Facebook</h3>
                      <p className="text-sm text-muted-foreground">Social media integration</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" variant="outline">
                      Connect
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-500/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-amber-500"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Slack</h3>
                      <p className="text-sm text-muted-foreground">Team notifications</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button className="w-full" variant="outline">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Browse Integration Marketplace
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Configure webhooks to receive real-time event notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-medium">Booking Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive notifications when bookings are created or updated
                </p>
              </div>
              <Switch checked={true} />
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <Label htmlFor="booking-webhook" className="text-sm">
                  Webhook URL
                </Label>
                <Input
                  id="booking-webhook"
                  value="https://api.luxtour.com/webhooks/bookings"
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm">Save</Button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-medium">Client Communications</h3>
                <p className="text-sm text-muted-foreground">Receive notifications for new client messages</p>
              </div>
              <Switch checked={false} />
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <Label htmlFor="comms-webhook" className="text-sm">
                  Webhook URL
                </Label>
                <Input id="comms-webhook" placeholder="https://example.com/webhook" disabled />
              </div>
              <div className="mt-4 flex justify-end">
                <Button size="sm" disabled>
                  Save
                </Button>
              </div>
            </div>
          </div>

          <Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Add New Webhook
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
