import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, PlusCircle, Search } from "lucide-react"
import { AgentsList } from "@/components/agents-list"

export default function AgentsPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Agents</h2>
          <p className="text-muted-foreground">Configure and manage your AI agents for different tasks.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Agent
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search agents..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Agents
            <Badge variant="secondary" className="ml-2">
              5
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            <Badge variant="secondary" className="ml-2">
              4
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive
            <Badge variant="secondary" className="ml-2">
              1
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="custom">
            Custom
            <Badge variant="secondary" className="ml-2">
              2
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <AgentsList />
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Agents</CardTitle>
              <CardDescription>Agents that are currently active and processing tasks.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Active agents content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Agents</CardTitle>
              <CardDescription>Agents that are currently disabled or paused.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Inactive agents content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Agents</CardTitle>
              <CardDescription>Custom agents you've created with specific capabilities.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Custom agents content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
