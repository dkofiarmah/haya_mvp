'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Edit, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabaseClient } from "@/lib/supabase/auth-client"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { useOrganization } from "@/lib/organizations"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Customer type definition from database schema
type Customer = {
  id: string
  org_id: string
  name: string | null
  email: string | null
  phone: string | null
  address: any
  preferences: any
  trip_history: any[] | null
  tags: string[] | null
  metadata: any
  created_at: string
  updated_at: string
  // UI-specific properties
  avatar?: string
  lastActivity?: string
}

const CustomersList = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { currentOrganization } = useOrganization()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!currentOrganization?.id) {
        setLoading(false)
        return
      }

      try {
        // Direct query with proper types
        const { data, error } = await supabaseClient
          .from('customers')
          .select('*')
          .eq('org_id', currentOrganization.id)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        if (data) {
          const processedCustomers = data.map((customer: Customer) => {
            const customerName = customer.name || 'Unnamed Customer'
            const nameInitials = customerName
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
            
            return {
              ...customer,
              name: customerName,
              avatar: nameInitials,
              lastActivity: new Date(customer.updated_at).toLocaleDateString()
            }
          })
          
          setCustomers(processedCustomers)
        }
      } catch (error) {
        console.error('Error fetching customers:', error)
        toast({
          title: 'Error',
          description: 'Failed to load customers. Please try again.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [currentOrganization, toast])

  const handleDeleteCustomer = async (id: string) => {
    try {
      setDeleting(id)
      
      const { error } = await supabaseClient
        .from('customers')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setCustomers(prevCustomers => prevCustomers.filter(customer => customer.id !== id))
      
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete customer. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setDeleting(null)
    }
  }
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phone && customer.phone.includes(searchTerm))
  )
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading customers...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Customer</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  {searchTerm ? 'No customers match your search' : 'No customers found. Add your first customer!'}
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{customer.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.phone || 'N/A'}</TableCell>
                  <TableCell>{customer.lastActivity}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/customers/${customer.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteCustomer(customer.id)}
                          disabled={deleting === customer.id}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deleting === customer.id ? 'Deleting...' : 'Delete customer'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default CustomersList
