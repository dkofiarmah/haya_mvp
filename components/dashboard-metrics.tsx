"use client"

import { useState } from "react"
import { 
  CalendarDays, 
  MessageSquare, 
  Users, 
  Wallet,
  Bot,
  Globe,
  AlertCircle,
  LucideIcon,
  Map
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/providers/supabase-auth-provider"

interface MetricProps {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
  change?: string
  trend?: "up" | "down"
}

interface DashboardMetricsProps {
  metrics: MetricProps[]
}

function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  return (
    <div className="space-y-8">
      {/* Core metrics row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                {metric.change && (
                  <p className="text-xs text-muted-foreground">
                    <span className={metric.trend === "up" ? "text-emerald-500" : "text-red-500"}>
                      {metric.change}
                    </span>
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI assistant performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>AI Agent Activity</CardTitle>
            <CardDescription>Your AI Assistants are working 24/7 for your business</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-md p-2 hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Bot className="h-5 w-5 text-blue-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Discovery Agent</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Helped 14 potential customers</span>
                    <Badge variant="outline" className="bg-blue-50">Active now</Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Details
                </Button>
              </div>
              
              <div className="flex items-center gap-4 rounded-md p-2 hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <Map className="h-5 w-5 text-green-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Itinerary Agent</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Created 8 trip plans</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Details
                </Button>
              </div>
              
              <div className="flex items-center gap-4 rounded-md p-2 hover:bg-muted/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <MessageSquare className="h-5 w-5 text-purple-700" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Communication Agent</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Sent 42 messages across WhatsApp, Email, and Instagram</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Agent Activities</Button>
          </CardFooter>
        </Card>
        
        {/* Attention needed card */}
        <Card>
          <CardHeader>
            <CardTitle>Needs Your Attention</CardTitle>
            <CardDescription>Tasks that require human input</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-md p-2 hover:bg-muted/50">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Custom Safari Request</p>
                  <p className="text-xs text-muted-foreground">Lisa M. requested a custom safari with specific wildlife interests</p>
                  <div className="mt-2">
                    <Button size="sm" variant="default">Review</Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 rounded-md p-2 hover:bg-muted/50">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Price Confirmation</p>
                  <p className="text-xs text-muted-foreground">Tour #1245 needs final pricing approval</p>
                  <div className="mt-2">
                    <Button size="sm" variant="default">Review</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Tasks</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Recent activity & upcoming tours */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Customer Activity</CardTitle>
            <CardDescription>Latest interactions with your clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">James B. requested a trip itinerary to Serengeti</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tours</CardTitle>
            <CardDescription>Tours starting in the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">Zanzibar Beach Retreat</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">Apr 19-25</p>
                      <Badge variant="outline">4 Guests</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Tours</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quick action row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button className="flex flex-col h-24 gap-1 items-center justify-center">
          <Globe className="h-6 w-6 mb-1" />
          <span>Create Experience</span>
        </Button>
        <Button className="flex flex-col h-24 gap-1 items-center justify-center">
          <Map className="h-6 w-6 mb-1" />
          <span>Plan New Itinerary</span>
        </Button>
        <Button className="flex flex-col h-24 gap-1 items-center justify-center">
          <Users className="h-6 w-6 mb-1" />
          <span>Add Customer</span>
        </Button>
        <Button className="flex flex-col h-24 gap-1 items-center justify-center">
          <Bot className="h-6 w-6 mb-1" />
          <span>Tune AI Assistant</span>
        </Button>
      </div>
    </div>
  )
}

export { DashboardMetrics }
export default DashboardMetrics
