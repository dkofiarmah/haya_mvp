import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, PlusCircle, Search } from "lucide-react"
import { MessagesList } from "@/components/messages-list"
import { MessageChannels } from "@/components/message-channels"
import Link from "next/link"

export default function MessagesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground mt-1">Manage communications with your customers</p>
        </div>
        <Button asChild>
          <Link href="/messages/compose">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Message
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <MessageChannels />
        </div>
        <div className="md:col-span-3">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search messages..." className="w-full pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Tabs defaultValue="all" className="mt-6 space-y-6">
            <TabsList>
              <TabsTrigger value="all">
                All Messages
                <Badge variant="secondary" className="ml-2">
                  24
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge variant="secondary" className="ml-2">
                  5
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="ai-handled">
                AI Handled
                <Badge variant="secondary" className="ml-2">
                  12
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="flagged">
                Flagged
                <Badge variant="secondary" className="ml-2">
                  3
                </Badge>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-6">
              <MessagesList />
            </TabsContent>
            <TabsContent value="unread" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Unread Messages</CardTitle>
                  <CardDescription>Messages that have not been read yet</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Unread messages content will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="ai-handled" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>AI Handled Messages</CardTitle>
                  <CardDescription>Messages that were automatically handled by AI assistants</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">AI handled messages content will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="flagged" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Flagged Messages</CardTitle>
                  <CardDescription>Messages that require your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Flagged messages content will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
