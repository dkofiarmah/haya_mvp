"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Bot,
  Calendar,
  MessageSquare,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Compass,
  BookOpen,
  Globe,
} from "lucide-react"
import { DashboardMetrics } from "@/components/dashboard-metrics"
import { RecentBookings } from "@/components/recent-bookings"
import { RecentConversations } from "@/components/recent-conversations"
import { useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase/auth-client"

// Dashboard content component
function DashboardContent() {
  const [metrics, setMetrics] = useState({
    assistantsCount: 0,
    conversationsCount: 0,
    bookingsCount: 0,
    customersCount: 0,
    isLoading: true
  })

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Fetch counts from database
        const [
          { count: assistantsCount },
          { count: conversationsCount },
          { count: bookingsCount },
          { count: customersCount },
        ] = await Promise.all([
          supabaseClient.from("ai_assistants").select("*", { count: "exact", head: true }),
          supabaseClient.from("conversations").select("*", { count: "exact", head: true }),
          supabaseClient.from("bookings").select("*", { count: "exact", head: true }),
          supabaseClient.from("customers").select("*", { count: "exact", head: true }),
        ])

        setMetrics({
          assistantsCount: assistantsCount || 0,
          conversationsCount: conversationsCount || 0,
          bookingsCount: bookingsCount || 0,
          customersCount: customersCount || 0,
          isLoading: false
        })
      } catch (error) {
        console.error("Error fetching dashboard counts:", error)
        setMetrics(prev => ({ ...prev, isLoading: false }))
      }
    }

    fetchCounts()
  }, [])

  return (
    <>
      <DashboardMetrics
        metrics={[
          {
            title: "AI Assistants",
            value: metrics.assistantsCount,
            description: "Active digital concierges",
            icon: Bot,
            change: "+2 this month",
            trend: "up",
          },
          {
            title: "Conversations",
            value: metrics.conversationsCount,
            description: "Client interactions",
            icon: MessageSquare,
            change: "+24% from last month",
            trend: "up",
          },
          {
            title: "Bookings",
            value: metrics.bookingsCount,
            description: "Confirmed reservations",
            icon: Calendar,
            change: "+12% from last month",
            trend: "up",
          },
          {
            title: "Customers",
            value: metrics.customersCount,
            description: "Luxury clientele",
            icon: Users,
            change: "+8% from last month",
            trend: "up",
          },
        ]}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.6%</div>
            <p className="text-xs text-muted-foreground">
              Booking conversion rate
            </p>
            <div className="mt-4">
              <Link 
                href="/analytics" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                View analytics <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intelligence</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              AI agent knowledge documents
            </p>
            <div className="mt-4">
              <Link 
                href="/agents" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                Manage AI agents <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiences</CardTitle>
            <Compass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">
              Tour experiences in catalog
            </p>
            <div className="mt-4">
              <Link 
                href="/experiences" 
                className="flex items-center text-sm text-primary hover:underline"
              >
                View experiences <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentBookings />
        <RecentConversations />
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Helpful links to get started with your Haya platform
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-4">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Read the full platform documentation
                </p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                View
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">API References</h3>
                <p className="text-sm text-muted-foreground">
                  Explore the Haya API endpoints
                </p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                View
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <Bot className="h-5 w-5 text-muted-foreground" />
              <div>
                <h3 className="font-medium">AI Assistant Training</h3>
                <p className="text-sm text-muted-foreground">
                  Learn how to train your AI assistants
                </p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto">
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Haya</h1>
        <p className="text-muted-foreground">Your AI-powered platform for extraordinary luxury tour experiences</p>
      </div>

      <Suspense fallback={<div className="flex justify-center p-4">Loading dashboard data...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
