'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from '@/components/ui/use-toast'
import { formatCurrency } from '@/lib/utils'
import ExperienceBookingWidget from './experience-booking-widget'
import {
  CircleCheck,
  CircleX,
  Clock,
  Users,
  MapPin,
  Tag,
  ChevronRight,
  Globe,
  DollarSign,
  Share2,
  Calendar
} from 'lucide-react'

interface PublicExperienceViewProps {
  experience: any
}

export default function PublicExperienceView({ experience }: PublicExperienceViewProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0)
  
  // Handle sharing the experience
  const handleShare = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Experience link copied to clipboard',
    })
  }
  
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Images */}
        <div className="lg:col-span-2 relative">
          {experience.images && experience.images.length > 0 ? (
            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 relative">
                <Image
                  src={experience.images[mainImageIndex]}
                  alt={experience.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
              {experience.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {experience.images.map((_, index: number) => (
                    <button
                      key={index}
                      onClick={() => setMainImageIndex(index)}
                      className={`w-2.5 h-2.5 rounded-full ${
                        index === mainImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
              <p>No image available</p>
            </div>
          )}
            
          {/* Thumbnail Gallery (visible only on larger screens) */}
          {experience.images && experience.images.length > 1 && (
            <div className="hidden md:grid grid-cols-6 gap-2 p-2">
              {experience.images.slice(0, 6).map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setMainImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden relative ${
                    index === mainImageIndex ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Experience image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Booking Panel */}
        <div className="p-6 border-t lg:border-t-0 lg:border-l">
          {experience.is_bookable_online ? (
            <ExperienceBookingWidget experience={experience} />
          ) : (
            <>
              <h1 className="text-2xl font-bold">{experience.name}</h1>
              <p className="text-lg text-gray-700 mt-1">
                {experience.category} • {experience.location}
              </p>
              
              <div className="mt-6 space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <p className="text-3xl font-bold">
                      {formatCurrency(experience.price_per_person, experience.currency)}
                    </p>
                    <p className="text-gray-500">per person</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Duration</p>
                      <p className="text-sm text-gray-500">
                        {experience.duration_minutes >= 60 
                          ? `${Math.floor(experience.duration_minutes / 60)} hour${Math.floor(experience.duration_minutes / 60) !== 1 ? 's' : ''}` 
                          : ''}
                        {experience.duration_minutes % 60 > 0 
                          ? `${experience.duration_minutes >= 60 ? ' ' : ''}${experience.duration_minutes % 60} minute${experience.duration_minutes % 60 !== 1 ? 's' : ''}` 
                          : ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Group Size</p>
                      <p className="text-sm text-gray-500">
                        {experience.min_group_size} to {experience.max_group_size} people
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Location</p>
                      <p className="text-sm text-gray-500">{experience.location}</p>
                      {experience.meeting_point && (
                        <p className="text-xs text-gray-500 mt-1">Meeting point: {experience.meeting_point}</p>
                      )}
                    </div>
                  </div>
                  
                  {experience.languages && experience.languages.length > 0 && (
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">Languages</p>
                        <p className="text-sm text-gray-500">
                          {experience.languages.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start">
                    <Tag className="h-5 w-5 text-gray-500 mt-1 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Cancellation Policy</p>
                      <p className="text-sm text-gray-500">{experience.cancellation_policy}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-center text-gray-500">
                    To book this experience, please contact us directly.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Description and Details */}
      <div className="px-6 py-8 border-t">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">About this experience</h2>
              <div className="prose max-w-none">
                <p>{experience.description}</p>
              </div>
            </div>
            
            {experience.highlights && experience.highlights.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Highlights</h2>
                <ul className="space-y-2">
                  {experience.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="ml-2">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {experience.included && experience.included.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">What's Included</h2>
                  <ul className="space-y-2">
                    {experience.included.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CircleCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {experience.not_included && experience.not_included.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Not Included</h2>
                  <ul className="space-y-2">
                    {experience.not_included.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CircleX className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="ml-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {experience.requirements && experience.requirements.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Requirements</h2>
                <ul className="space-y-2">
                  {experience.requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="ml-2">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            {/* CTA Card for smaller screens */}
            <div className="lg:hidden bg-blue-50 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold">
                {formatCurrency(experience.price_per_person, experience.currency)}
                <span className="text-lg font-normal text-gray-600"> / person</span>
              </p>
              <button
                className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Now
              </button>
            </div>
            
            {/* Tags if available */}
            {experience.tags && experience.tags.length > 0 && (
              <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-semibold">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {experience.tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
