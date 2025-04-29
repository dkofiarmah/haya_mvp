"use client"

// Import client components via our wrapper to help with Vercel tracing
import {
  DashboardMetrics,
  OnboardingBanner,
  useAuth,
  useOnboarding,
  supabaseClient
} from "./nan/_client-components"
import { BarChart3, CalendarDays, Users2, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

interface Metric {
  title: string
  value: string
  description: string
  icon: typeof DollarSign
  trend: "up" | "down"
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { isComplete } = useOnboarding()
  const [metrics, setMetrics] = useState({
    revenue: 0,
    bookings: 0,
    customerGrowth: 0,
    avgBookingValue: 0,
    isLoading: true
  })

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Use the shared supabaseClient for consistency
        const supabase = supabaseClient
        
        // Add error logging for better debugging
        console.log("Fetching data from Supabase...");
        
        // Fetch metrics from database
        const now = new Date()
        const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        
        // First check if tables exist before querying them
        try {
          const { error: tableCheckError } = await supabase
            .from("bookings")
            .select("id", { count: "exact", head: true })
            .limit(1);
          
          if (tableCheckError) {
            console.error("Error checking tables:", tableCheckError);
            throw new Error("Database tables may not be set up correctly");
          }
        } catch (tableError) {
          console.error("Table check failed:", tableError);
          setMetrics(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        // Use the correct column name 'total_price' instead of 'amount'
        const [bookingsResult, customersResult, lastMonthResult] = await Promise.all([
          supabase.from("bookings").select("total_price"),
          supabase.from("customers").select("*", { count: "exact", head: true }),
          supabase.from("customers")
            .select("*", { count: "exact", head: true })
            .lte("created_at", lastMonth.toISOString())
        ])

        if (bookingsResult.data) {
          const totalRevenue = bookingsResult.data.reduce((sum, booking) => {
            // Handle both string and number types for total_price
            const price = typeof booking.total_price === 'string' 
              ? parseFloat(booking.total_price) 
              : (booking.total_price || 0);
            return sum + price;
          }, 0);
          
          const avgBookingValue = bookingsResult.data.length > 0 ? totalRevenue / bookingsResult.data.length : 0
          
          // Handle customer growth calculation with proper null checks
          const currentCount = customersResult.count || 0
          const previousCount = lastMonthResult.count || 0
          const customerGrowth = previousCount > 0 ? ((currentCount - previousCount) / previousCount) * 100 : 0

          setMetrics({
            revenue: totalRevenue,
            bookings: bookingsResult.data.length,
            customerGrowth,
            avgBookingValue,
            isLoading: false
          })
        }
      } catch (error) {
        console.error("Error fetching dashboard counts:", error)
        setMetrics(prev => ({ ...prev, isLoading: false }))
      }
    }

    if (user) {
      fetchCounts()
    }
  }, [user])

  const metricsData: Metric[] = [
    {
      title: "Total Revenue",
      value: `$${metrics.revenue.toLocaleString()}`,
      description: "Last 30 days",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Active Bookings",
      value: metrics.bookings.toString(),
      description: "Current period",
      icon: CalendarDays,
      trend: "up"
    },
    {
      title: "Customer Growth",
      value: `${metrics.customerGrowth.toFixed(1)}%`,
      description: "Month over month",
      icon: Users2,
      trend: metrics.customerGrowth >= 0 ? "up" : "down"
    },
    {
      title: "Average Booking Value",
      value: `$${metrics.avgBookingValue.toLocaleString()}`,
      description: "Per booking",
      icon: BarChart3,
      trend: "up"
    }
  ]

  return (
    <div className="container py-6">
      {!isComplete && <OnboardingBanner />}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Welcome back!</h1>
      </div>
      <DashboardMetrics metrics={metricsData} />
    </div>
  )
}
