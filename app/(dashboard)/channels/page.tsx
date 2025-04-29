'use client'

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, PlusCircle, Search } from "lucide-react"
import { ChannelsList } from "@/components/channels-list"

// This tells Next.js not to attempt prerendering this page
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function ChannelsPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Communication Channels</h2>
          <p className="text-muted-foreground">Configure and manage communication channels for client interactions.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Channel
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search channels..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Channels
            <Badge variant="secondary" className="ml-2">
              7
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              5
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive
            <Badge variant="secondary" className="ml-2">
              2
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Suspense fallback={<div>Loading channels...</div>}>
            <ChannelsList />
          </Suspense>
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Channels</CardTitle>
              <CardDescription>Channels that are currently active and receiving messages.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Active channels content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Channels</CardTitle>
              <CardDescription>Channels that are currently disabled or paused.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Inactive channels content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
