'use server'

import { createDirectServerClient } from '@/lib/supabase/server'

// Get experience analytics data
export async function getExperienceAnalytics(experienceId: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get view count
    const { data: experience, error: viewError } = await supabase
      .from('experiences')
      .select('view_count, booking_count')
      .eq('id', experienceId)
      .single()
    
    if (viewError) {
      throw new Error(`Failed to fetch view count: ${viewError.message}`)
    }
    
    // Get monthly views data (for charts)
    const today = new Date()
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(today.getMonth() - 6)
    
    const { data: monthlyViews, error: monthlyError } = await supabase
      .from('experience_audit_logs')
      .select('created_at')
      .eq('experience_id', experienceId)
      .eq('action_type', 'viewed')
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true })
    
    if (monthlyError) {
      console.error('Error fetching monthly views:', monthlyError)
    }
    
    // Get booking trend data (for charts)
    const { data: bookingData, error: bookingError } = await supabase
      .from('experience_bookings')
      .select('created_at, party_size, total_price')
      .eq('experience_id', experienceId)
      .gte('created_at', sixMonthsAgo.toISOString())
      .order('created_at', { ascending: true })
    
    if (bookingError) {
      console.error('Error fetching booking data:', bookingError)
    }
    
    // Process monthly views into chart data
    const monthlyViewsData = processMonthlyData(monthlyViews || [])
    
    // Process booking data into chart data
    const monthlyBookingsData = processBookingData(bookingData || [])
    
    return {
      success: true,
      analytics: {
        viewCount: experience?.view_count || 0,
        bookingCount: experience?.booking_count || 0,
        monthlyViews: monthlyViewsData,
        monthlyBookings: monthlyBookingsData,
        // Calculate revenue if we have booking data
        totalRevenue: bookingData?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0,
        // Get average party size
        averagePartySize: bookingData?.length 
          ? bookingData.reduce((sum, booking) => sum + (booking.party_size || 0), 0) / bookingData.length 
          : 0
      }
    }
  } catch (error) {
    console.error('Error in getExperienceAnalytics:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      analytics: {
        viewCount: 0,
        bookingCount: 0,
        monthlyViews: [],
        monthlyBookings: [],
        totalRevenue: 0,
        averagePartySize: 0
      }
    }
  }
}

// Helper function to process monthly views data
function processMonthlyData(logs: any[]) {
  const months: Record<string, number> = {}
  
  // Initialize last 6 months
  const today = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(today.getMonth() - i)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months[monthKey] = 0
  }
  
  // Count views by month
  logs.forEach(log => {
    const date = new Date(log.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (months[monthKey] !== undefined) {
      months[monthKey]++
    }
  })
  
  // Convert to array format for charts
  return Object.entries(months).map(([month, count]) => ({
    month,
    count
  }))
}

// Helper function to process booking data
function processBookingData(bookings: any[]) {
  const months: Record<string, { count: number, revenue: number }> = {}
  
  // Initialize last 6 months
  const today = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(today.getMonth() - i)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months[monthKey] = { count: 0, revenue: 0 }
  }
  
  // Process bookings by month
  bookings.forEach(booking => {
    const date = new Date(booking.created_at)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (months[monthKey]) {
      months[monthKey].count++
      months[monthKey].revenue += booking.total_price || 0
    }
  })
  
  // Convert to array format for charts
  return Object.entries(months).map(([month, data]) => ({
    month,
    count: data.count,
    revenue: data.revenue
  }))
}

// Export analytics data directly as named export for easier importing
export { getExperienceAnalytics }
