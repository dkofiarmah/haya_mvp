'use client'

import { useState, useEffect } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  BarChart,
  BarChart3,
  Calendar,
  Clock,
  ClipboardCheck,
  ClipboardList,
  Clock10,
  DollarSign,
  Eye,
  FileCheck,
  FileEdit,
  SquarePen,
  User,
  Users
} from 'lucide-react'
import { getExperienceAnalytics } from '@/app/actions/experience-analytics'
import { getExperienceBookings } from '@/app/actions/experience-bookings'
import { getExperienceAuditLogs } from '@/app/actions/experience-audit'

export default function ExperienceManagement({
  experienceId
}: {
  experienceId: string
}) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState({
    analytics: true,
    bookings: true,
    logs: true
  })
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch analytics
        const analyticsResult = await getExperienceAnalytics(experienceId)
        // Handle the return format from experience-analytics.ts
        if (analyticsResult && analyticsResult.success) {
          setAnalytics(analyticsResult.analytics)
        }
        setLoading(prev => ({ ...prev, analytics: false }))
        
        // Fetch bookings - this directly returns an array
        const bookingsResult = await getExperienceBookings(experienceId)
        setBookings(Array.isArray(bookingsResult) ? bookingsResult : [])
        setLoading(prev => ({ ...prev, bookings: false }))
        
        // Fetch audit logs - this directly returns an array
        const logsResult = await getExperienceAuditLogs(experienceId)
        setLogs(Array.isArray(logsResult) ? logsResult : [])
        setLoading(prev => ({ ...prev, logs: false }))
        
      } catch (error) {
        console.error('Error fetching management data:', error)
        toast({
          title: 'Error',
          description: 'Failed to load experience management data.',
          variant: 'destructive'
        })
        // Ensure loading states are updated even in case of error
        setLoading({
          analytics: false,
          bookings: false,
          logs: false
        })
      }
    }
    
    fetchData()
  }, [experienceId])
  
  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Get status badge class
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <Tabs defaultValue="metrics">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="metrics">
          <BarChart3 className="h-4 w-4 mr-2" />
          Metrics
        </TabsTrigger>
        <TabsTrigger value="bookings">
          <Calendar className="h-4 w-4 mr-2" />
          Bookings
        </TabsTrigger>
        <TabsTrigger value="history">
          <ClipboardList className="h-4 w-4 mr-2" />
          Activity Log
        </TabsTrigger>
      </TabsList>
      
      {/* Metrics Tab */}
      <TabsContent value="metrics">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Analytics and performance metrics for this experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading.analytics ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Loading metrics...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Views"
                  value={analytics?.views || 0}
                  description="Total page views"
                  icon={<Eye className="h-4 w-4 text-blue-600" />}
                />
                <MetricCard
                  title="Bookings"
                  value={analytics?.bookings || 0}
                  description="Total bookings"
                  icon={<ClipboardCheck className="h-4 w-4 text-green-600" />}
                />
                <MetricCard
                  title="Revenue"
                  value={`$${analytics?.revenue || 0}`}
                  description="Total revenue"
                  icon={<DollarSign className="h-4 w-4 text-emerald-600" />}
                />
                <MetricCard
                  title="Guests"
                  value={analytics?.guests || 0}
                  description="Total guests"
                  icon={<Users className="h-4 w-4 text-indigo-600" />}
                />
                <MetricCard
                  title="Conversion Rate"
                  value={`${analytics?.conversionRate || 0}%`}
                  description="Views to bookings"
                  icon={<BarChart className="h-4 w-4 text-purple-600" />}
                />
                <MetricCard
                  title="Avg. Group Size"
                  value={analytics?.avgGroupSize || 0}
                  description="Per booking"
                  icon={<User className="h-4 w-4 text-orange-600" />}
                />
                <MetricCard
                  title="Avg. Rating"
                  value={analytics?.avgRating || 'N/A'}
                  description={`${analytics?.totalReviews || 0} reviews`}
                  icon={<FileCheck className="h-4 w-4 text-yellow-600" />}
                />
                <MetricCard
                  title="Avg. Response Time"
                  value={analytics?.avgResponseTime || 'N/A'}
                  description="To booking requests"
                  icon={<Clock className="h-4 w-4 text-red-600" />}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Bookings Tab */}
      <TabsContent value="bookings">
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              All bookings for this experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading.bookings ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            ) : bookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Party Size</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(booking => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">
                        {booking.customer_name}
                        <div className="text-xs text-muted-foreground">
                          {booking.customer_email}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(booking.booking_date)}</TableCell>
                      <TableCell>{booking.party_size}</TableCell>
                      <TableCell>${booking.total_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">No bookings found for this experience.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Activity Log Tab */}
      <TabsContent value="history">
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <CardDescription>
              History of changes and actions for this experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading.logs ? (
              <div className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Loading activity logs...</p>
              </div>
            ) : logs.length > 0 ? (
              <div className="space-y-4">
                {logs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 pb-4 border-b">
                    <div className="bg-muted p-2 rounded-full">
                      {getLogIcon(log.action_type)}
                    </div>
                    <div>
                      <p className="font-medium">
                        {formatLogAction(log.action_type)}
                        {log.users && (
                          <span className="font-normal text-muted-foreground"> by {log.users.email}</span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(log.created_at)}
                      </p>
                      {log.changes && Object.keys(log.changes).length > 0 && (
                        <div className="mt-2 text-sm">
                          <details>
                            <summary className="cursor-pointer text-primary">View changes</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                              {JSON.stringify(log.changes, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">No activity logs found for this experience.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Metric card component
function MetricCard({ 
  title, 
  value, 
  description, 
  icon 
}: { 
  title: string, 
  value: number | string, 
  description: string, 
  icon?: React.ReactNode 
}) {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  )
}

// Helper to get icon for log action
function getLogIcon(actionType: string) {
  switch (actionType) {
    case 'created':
      return <SquarePen className="h-4 w-4 text-green-600" />
    case 'updated':
      return <FileEdit className="h-4 w-4 text-blue-600" />
    case 'archived':
      return <ClipboardList className="h-4 w-4 text-amber-600" />
    case 'restored':
      return <Clock10 className="h-4 w-4 text-purple-600" />
    default:
      return <FileEdit className="h-4 w-4 text-gray-600" />
  }
}

// Helper to format log action
function formatLogAction(actionType: string): string {
  switch (actionType) {
    case 'created':
      return 'Experience created'
    case 'updated':
      return 'Experience updated'
    case 'archived':
      return 'Experience archived'
    case 'restored':
      return 'Experience restored'
    case 'shared':
      return 'Sharing enabled'
    case 'unshared':
      return 'Sharing disabled'
    case 'viewed':
      return 'Experience viewed'
    case 'booking_created':
      return 'Booking created'
    case 'booking_updated':
      return 'Booking updated'
    case 'booking_cancelled':
      return 'Booking cancelled'
    default:
      return actionType.charAt(0).toUpperCase() + actionType.slice(1).replace(/_/g, ' ')
  }
}
