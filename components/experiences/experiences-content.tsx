"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, Search, Grid, List, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase/auth-client"
import ExperienceCard from "@/components/experiences/experience-card"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Experience {
  id: string
  name: string
  description: string
  category: string
  price_per_person: number
  duration_minutes: number
  max_group_size: number
  is_active: boolean
  is_archived?: boolean
  is_shareable?: boolean 
  is_bookable_online?: boolean
  images: string[] | null
  location?: string
  view_count?: number
  booking_count?: number
  created_at: string
  updated_at: string
  organization_id?: string
}

export default function ExperiencesContent() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Experience,
    direction: 'asc' | 'desc'
  }>({ key: 'created_at', direction: 'desc' })
  const [filter, setFilter] = useState<{
    status: 'all' | 'active' | 'inactive' | 'archived',
    search: string
  }>({
    status: 'all',
    search: ''
  })

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true)
        
        const { data, error } = await supabaseClient
          .from('experiences')
          .select('*')
          .order(sortConfig.key, { ascending: sortConfig.direction === 'asc' })
          
        if (error) {
          throw error
        }
        
        setExperiences(data || [])
      } catch (error) {
        console.error('Error fetching experiences:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [sortConfig])

  // Filter experiences based on search and status
  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = filter.search === '' || 
      exp.name.toLowerCase().includes(filter.search.toLowerCase()) ||
      exp.description.toLowerCase().includes(filter.search.toLowerCase()) ||
      exp.category.toLowerCase().includes(filter.search.toLowerCase())
    
    const matchesStatus = 
      filter.status === 'all' ||
      (filter.status === 'active' && exp.is_active && !exp.is_archived) ||
      (filter.status === 'inactive' && !exp.is_active && !exp.is_archived) ||
      (filter.status === 'archived' && exp.is_archived)
    
    return matchesSearch && matchesStatus
  })

  const handleSort = (key: keyof Experience) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Filters and View Toggle */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search experiences..." 
            className="w-full md:w-80"
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
          />
          <Select 
            value={filter.status}
            onValueChange={(value) => setFilter(prev => ({ ...prev, status: value as any }))}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={cn(viewMode === 'grid' && "bg-primary text-primary-foreground")}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={cn(viewMode === 'list' && "bg-primary text-primary-foreground")}
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center p-12">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading experiences...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredExperiences.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold">No experiences found</h3>
          <p className="text-muted-foreground">
            {filter.search || filter.status !== 'all' 
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first experience"}
          </p>
          {!filter.search && filter.status === 'all' && (
            <Button asChild className="mt-4">
              <Link href="/experiences/new">Create New Experience</Link>
            </Button>
          )}
        </div>
      )}

      {/* Grid View */}
      {!loading && filteredExperiences.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredExperiences.map(experience => (
            <ExperienceCard 
              key={experience.id} 
              experience={experience} 
            />
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && filteredExperiences.length > 0 && viewMode === 'list' && (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button variant="ghost" className="px-1" onClick={() => handleSort('name')}>
                      Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="px-1" onClick={() => handleSort('category')}>
                      Category
                      {sortConfig.key === 'category' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="px-1" onClick={() => handleSort('price_per_person')}>
                      Price
                      {sortConfig.key === 'price_per_person' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button variant="ghost" className="px-1" onClick={() => handleSort('created_at')}>
                      Created
                      {sortConfig.key === 'created_at' && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperiences.map(experience => (
                  <TableRow key={experience.id}>
                    <TableCell className="font-medium">
                      <Link href={`/experiences/${experience.id}`} className="hover:underline">
                        {experience.name}
                      </Link>
                    </TableCell>
                    <TableCell>{experience.category}</TableCell>
                    <TableCell>{formatPrice(experience.price_per_person)}</TableCell>
                    <TableCell>
                      {experience.is_archived ? (
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">Archived</Badge>
                      ) : experience.is_active ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(experience.created_at)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/experiences/${experience.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/experiences/${experience.id}/edit`}>Edit Experience</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
