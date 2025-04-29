'use client'

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Eye, Calendar, Star, DollarSign } from "lucide-react"
import { Experience } from "@/app/actions/experiences-api"

interface ExperienceCardProps {
  experience: Experience
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`
    }
    return `${minutes}m`
  }

  return (
    <Link href={`/experiences/${experience.id}`}>
      <div className="group h-full">
        <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
          <div className="aspect-video relative bg-muted">
            {experience.images && experience.images[0] ? (
              <img
                src={experience.images[0]}
                alt={experience.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex flex-col gap-1">
              <Badge
                variant={experience.is_active ? "default" : "outline"}
              >
                {experience.is_active ? "Active" : "Inactive"}
              </Badge>
              
              {experience.is_archived && (
                <Badge variant="destructive">
                  Archived
                </Badge>
              )}
            </div>
          </div>
          
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{experience.category}</Badge>
              <span className="text-sm font-medium">${experience.price_per_person}</span>
            </div>
            <h3 className="text-lg font-semibold mt-2">{experience.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {experience.description}
            </p>
          </div>
          
          <div className="p-4 pt-0 flex-grow">
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center text-sm">
                <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatDuration(experience.duration_minutes)}
                </span>
                
                <span className="mx-2 text-muted-foreground">•</span>
                
                <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Up to {experience.max_group_size}
                </span>
              </div>
              
              {(experience.view_count !== undefined || experience.booking_count !== undefined) && (
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {experience.view_count !== undefined && (
                    <div className="flex items-center mr-3">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{experience.view_count} views</span>
                    </div>
                  )}
                  
                  {experience.booking_count !== undefined && experience.booking_count > 0 && (
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{experience.booking_count} bookings</span>
                    </div>
                  )}
                </div>
              )}
              
              {/* Shareable and bookable badges */}
              <div className="flex flex-wrap gap-1 mt-2">
                {experience.is_shareable && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    Shareable
                  </Badge>
                )}
                
                {experience.is_bookable_online && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    Online Booking
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  )
}

export default ExperienceCard
