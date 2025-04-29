"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, PlusCircle, Search } from "lucide-react"
import { ClientMessages } from "@/components/client-messages"

export default function CommunicationsPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Communications</h2>
          <p className="text-muted-foreground">Monitor and manage client communications handled by AI agents.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search messages..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Messages
            <Badge variant="secondary" className="ml-2">
              42
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge variant="secondary" className="ml-2">
              7
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ai-handled">
            AI Handled
            <Badge variant="secondary" className="ml-2">
              28
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="flagged">
            Flagged for Review
            <Badge variant="secondary" className="ml-2">
              3
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <ClientMessages />
        </TabsContent>
        <TabsContent value="unread" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unread Messages</CardTitle>
              <CardDescription>Messages that have not been read yet.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Unread messages content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-handled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Handled Messages</CardTitle>
              <CardDescription>Messages that were automatically handled by AI agents.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">AI handled messages content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged for Review</CardTitle>
              <CardDescription>Messages that AI agents flagged for human review.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Flagged messages content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
