// filepath: /Users/danny_1/_PROJECTS_/haya/haya_mvp/app/(dashboard)/bookings/page.tsx
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, Filter, Search } from 'lucide-react'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

// Tell Next.js this is a dynamic route that should not be statically generated
export const dynamic = 'force-dynamic';

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const getStatusBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

async function BookingsTable() {
  const supabase = createServerComponentClient<Database>({ cookies });
  
  // Get user's organizations - no param needed, uses auth.uid() by default
  const { data: orgs } = await supabase.rpc('get_user_organizations');
  const orgIds = orgs?.map(org => org.organization_id) || [];
  
  // Fetch bookings with customer info for user's organizations
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customers:customer_id (id, full_name, email)
    `)
    .in('organization_id', orgIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return <div>Error loading bookings. Please try again.</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">
                  <Link href={`/bookings/${booking.id}`} className="text-blue-600 hover:underline">
                    #{booking.id.substring(0, 8)}
                  </Link>
                </TableCell>
                <TableCell>
                  {booking.customers?.full_name || 'Unknown'}
                  <div className="text-xs text-gray-500">{booking.customers?.email}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusBadgeColor(booking.status || 'pending')}>
                    {booking.status || 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(booking.start_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.end_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  ${booking.total_amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center p-4">
                No bookings found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default async function BookingsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your customer bookings and reservations
          </p>
        </div>
        <Link href="/bookings/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search" 
                  placeholder="Search bookings..." 
                  className="pl-8"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<div className="flex justify-center p-8">Loading bookings...</div>}>
            <BookingsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
