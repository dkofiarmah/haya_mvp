import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Download, Filter, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AgentLogs({ agentId }: { agentId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Agent Activity Logs</CardTitle>
              <CardDescription>View detailed logs of agent activities and interactions.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search logs..." className="w-full pl-8" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Log type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Logs</SelectItem>
                  <SelectItem value="conversation">Conversations</SelectItem>
                  <SelectItem value="error">Errors</SelectItem>
                  <SelectItem value="action">Actions</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="24h">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Channel</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Status</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 10:23:45</div>
                <div className="col-span-2">
                  <Badge variant="outline">Conversation</Badge>
                </div>
                <div className="col-span-2">WhatsApp</div>
                <div className="col-span-4 text-sm">Initial client inquiry about Bali vacation options</div>
                <div className="col-span-2">
                  <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 10:25:12</div>
                <div className="col-span-2">
                  <Badge variant="outline">Action</Badge>
                </div>
                <div className="col-span-2">Internal</div>
                <div className="col-span-4 text-sm">Created client profile and preference record</div>
                <div className="col-span-2">
                  <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 10:28:37</div>
                <div className="col-span-2">
                  <Badge variant="outline">Conversation</Badge>
                </div>
                <div className="col-span-2">WhatsApp</div>
                <div className="col-span-4 text-sm">Sent follow-up questions about travel dates and budget</div>
                <div className="col-span-2">
                  <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 10:35:22</div>
                <div className="col-span-2">
                  <Badge variant="outline">Conversation</Badge>
                </div>
                <div className="col-span-2">WhatsApp</div>
                <div className="col-span-4 text-sm">Received client response with travel preferences</div>
                <div className="col-span-2">
                  <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 10:42:18</div>
                <div className="col-span-2">
                  <Badge variant="outline">Action</Badge>
                </div>
                <div className="col-span-2">Internal</div>
                <div className="col-span-4 text-sm">Queried knowledge base for Bali luxury accommodations</div>
                <div className="col-span-2">
                  <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 10:45:03</div>
                <div className="col-span-2">
                  <Badge variant="outline">System</Badge>
                </div>
                <div className="col-span-2">Internal</div>
                <div className="col-span-4 text-sm">Handoff to Itinerary Design Agent initiated</div>
                <div className="col-span-2">
                  <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 11:02:47</div>
                <div className="col-span-2">
                  <Badge variant="outline">Error</Badge>
                </div>
                <div className="col-span-2">Knowledge Base</div>
                <div className="col-span-4 text-sm">Failed to retrieve updated pricing for Villa Punto de Vista</div>
                <div className="col-span-2">
                  <Badge className="bg-red-500/10 text-red-500">Failed</Badge>
                </div>
              </div>
              <div className="grid grid-cols-12 items-center p-4">
                <div className="col-span-2 text-sm">2025-04-14 11:05:19</div>
                <div className="col-span-2">
                  <Badge variant="outline">System</Badge>
                </div>
                <div className="col-span-2">Internal</div>
                <div className="col-span-4 text-sm">Escalated pricing issue to human operator</div>
                <div className="col-span-2">
                  <Badge className="bg-amber-500/10 text-amber-500">Pending</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversation Details</CardTitle>
          <CardDescription>View detailed conversation logs with clients.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">WhatsApp Conversation #WA-2025-04-14-001</h3>
                <p className="text-sm text-muted-foreground">Client: John Davis • Started: 2025-04-14 10:23:45</p>
              </div>
              <Badge className="bg-green-500/10 text-green-500">Completed</Badge>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="text-xs font-medium">JD</span>
                </div>
                <div className="flex-1 rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    Hi, I'm interested in planning a luxury vacation to Bali for my wife and I for our anniversary in
                    June. Can you help with that?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">10:23:45</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-medium text-primary">AI</span>
                </div>
                <div className="flex-1 rounded-lg bg-primary/10 p-3">
                  <p className="text-sm">
                    Hello John! I'd be delighted to help you plan a luxury anniversary vacation to Bali in June. That's
                    a wonderful choice - Bali offers beautiful beaches, rich culture, and excellent luxury
                    accommodations. To help create the perfect experience for you, could you share a few details?
                    <br />
                    <br />
                    1. How long are you planning to stay in Bali?
                    <br />
                    2. Do you have a specific budget range in mind?
                    <br />
                    3. Are you more interested in beach relaxation, cultural experiences, adventure activities, or a
                    mix?
                    <br />
                    4. Do you have any specific preferences for accommodations (beachfront, jungle view, private villa,
                    luxury resort)?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">10:25:12</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <span className="text-xs font-medium">JD</span>
                </div>
                <div className="flex-1 rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    We're thinking about 7-10 days, and our budget is around $15,000 excluding flights. We'd like a mix
                    of relaxation and cultural experiences. We definitely want a private villa with a pool, preferably
                    with a nice view. We've heard Ubud and Seminyak are nice areas.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">10:35:22</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xs font-medium text-primary">AI</span>
                </div>
                <div className="flex-1 rounded-lg bg-primary/10 p-3">
                  <p className="text-sm">
                    Thank you for sharing those details, John. A 7-10 day stay with a $15,000 budget will allow for a
                    wonderful luxury experience in Bali. Ubud and Seminyak are excellent choices!
                    <br />
                    <br />
                    Ubud offers a serene jungle setting with cultural attractions, while Seminyak provides beachfront
                    luxury with great dining and shopping. I'd recommend splitting your time between both to experience
                    different aspects of Bali.
                    <br />
                    <br />
                    For accommodations, I can suggest some exceptional private villas with pools in both areas. Would
                    you prefer to:
                    <br />
                    <br />
                    1. Stay in one location and take day trips
                    <br />
                    2. Split your time between Ubud and a beach area like Seminyak
                    <br />
                    <br />
                    Also, are there any specific cultural experiences or activities you're particularly interested in?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">10:42:18</p>
                </div>
              </div>

              <div className="rounded-md border border-dashed p-3">
                <p className="text-center text-sm text-muted-foreground">
                  Conversation continued and was transferred to Itinerary Design Agent
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
