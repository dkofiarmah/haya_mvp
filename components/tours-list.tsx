'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, DollarSign, MapPin, Users } from "lucide-react"
import { supabaseClient } from "@/lib/supabase/auth-client"
import Link from "next/link"

interface Tour {
  id: string
  image_url?: string
  name: string
  title: string
  description: string
  status: string
  price: number
  location: string
  start_date: string
  duration: number
  max_capacity: number
  max_participants: number
}

interface ToursListProps {
  filterStatus?: string
}

export function ToursList({ filterStatus }: ToursListProps) {
  const [tours, setTours] = useState<Tour[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTours() {
      try {
        // Build query
        let query = supabaseClient.from("tours").select("*")

        // Apply filter if provided
        if (filterStatus) {
          query = query.eq("status", filterStatus)
        }

        // Execute query
        const { data, error: queryError } = await query

        if (queryError) throw queryError
        setTours(data || [])
      } catch (err) {
        console.error("Error fetching tours:", err)
        setError("Failed to load tours. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTours()
  }, [filterStatus])

  if (error) {
    return <div>{error}</div>
  }

  if (isLoading) {
    return <div>Loading tours...</div>
  }

  if (!tours || tours.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">No tours found</p>
          <p className="text-xs text-muted-foreground mt-1">Create a new tour to get started</p>
          <Button asChild className="mt-4">
            <Link href="/tours/create">Create New Tour</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tours.map((tour) => (
        <Card key={tour.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={tour.image_url || "/placeholder.svg?height=200&width=400"}
              alt={tour.name}
              className="object-cover w-full h-full"
            />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{tour.name}</CardTitle>
              <Badge variant={tour.status === 'active' ? 'default' : 'secondary'}>
                {tour.status}
              </Badge>
            </div>
            <CardDescription>{tour.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{tour.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>{tour.duration} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Max capacity: {tour.max_capacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>${tour.price}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/tours/${tour.id}`}>View Details</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
