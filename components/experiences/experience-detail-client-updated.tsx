'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Experience } from '@/app/actions/experiences-api'
import ExperienceActions from './experience-actions'
import { formatCurrency, formatDuration } from '@/lib/format-utils'

interface ExperienceDetailClientProps {
  experience: Experience;
}

export function ExperienceDetailClient({ experience }: ExperienceDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format the necessary fields for display
  const formattedDuration = formatDuration(experience.duration_minutes);
  const formattedPrice = formatCurrency(experience.price_per_person, experience.currency || 'USD');
  
  // Handle null arrays
  const highlights = experience.highlights || [];
  const included = experience.included || [];
  const notIncluded = experience.not_included || [];
  const requirements = experience.requirements || [];
  const languages = experience.languages || [];
  const tags = experience.tags || [];
  
  return (
    <div className="space-y-8">
      {/* Header with title and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{experience.name}</h1>
            <div className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
              experience.is_archived 
                ? "bg-gray-100 text-gray-800 border border-gray-300" 
                : experience.is_active 
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-yellow-100 text-yellow-800 border border-yellow-300"
            }`}>
              {experience.is_archived ? "Archived" : experience.is_active ? "Active" : "Inactive"}
            </div>
          </div>
          <p className="text-gray-500 mt-1">{experience.category}</p>
        </div>
        
        <div className="flex gap-2">
          <Link 
            href={`/experiences/${experience.id}/edit`}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-md shadow-sm hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </Link>
          
          <ExperienceActions experience={experience} />
        </div>
      </div>
      
      {/* Image Gallery */}
      <div className="rounded-lg overflow-hidden bg-gray-100 h-[300px] sm:h-[400px]">
        {experience.images && experience.images.length > 0 ? (
          <div className="relative w-full h-full">
            <img
              src={experience.images[0]}
              alt={experience.name}
              className="w-full h-full object-cover"
            />
            {experience.images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {experience.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2.5 h-2.5 rounded-full ${
                      idx === 0
                        ? 'bg-white'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">No images available</p>
          </div>
        )}
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b">
        <div className="flex -mb-px">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'booking'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('booking')}
          >
            Booking
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{experience.description}</p>
              </div>
              
              <div className="border-t p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>Duration</span>
                    </div>
                    <p className="font-medium">{formattedDuration}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      <span>Price</span>
                    </div>
                    <p className="font-medium">{formattedPrice}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>Group Size</span>
                    </div>
                    <p className="font-medium">{experience.min_group_size}-{experience.max_group_size} people</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>Location</span>
                    </div>
                    <p className="font-medium truncate">{experience.location}</p>
                  </div>
                </div>
              </div>
              
              {highlights.length > 0 && (
                <div className="border-t p-6">
                  <h3 className="text-lg font-semibold mb-3">Highlights</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    {highlights.map((highlight, index) => (
                      <li key={index} className="text-gray-600">{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="border-t p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 11 12 14 22 4"></polyline>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    What's Included
                  </h3>
                  {included.length > 0 ? (
                    <ul className="space-y-2">
                      {included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No inclusions specified</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                    </svg>
                    Not Included
                  </h3>
                  {notIncluded.length > 0 ? (
                    <ul className="space-y-2">
                      {notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No exclusions specified</p>
                  )}
                </div>
              </div>
              
              {requirements.length > 0 && (
                <div className="border-t p-6">
                  <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {requirements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(languages.length > 0 || experience.cancellation_policy) && (
                <div className="border-t p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {languages.map((language, index) => (
                          <span key={index} className="px-2 py-1 text-sm bg-gray-100 rounded-full">{language}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {experience.cancellation_policy && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Cancellation Policy</h3>
                      <p className="text-gray-600">{experience.cancellation_policy}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Booking Tab */}
        {activeTab === 'booking' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">Booking Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Online Booking</p>
                      <p className="text-sm text-gray-500">
                        {experience.is_bookable_online
                          ? 'Customers can book this experience online'
                          : 'Online booking is disabled'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      experience.is_bookable_online 
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}>
                      {experience.is_bookable_online ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Public Sharing</p>
                      <p className="text-sm text-gray-500">
                        {experience.is_shareable
                          ? 'Experience can be shared with a public link'
                          : 'Experience cannot be shared publicly'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      experience.is_shareable 
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 border border-gray-300"
                    }`}>
                      {experience.is_shareable ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  
                  {experience.is_shareable && experience.shareable_token && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-medium mb-2">Public Link</p>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-100 p-2 rounded text-sm flex-1 overflow-x-auto">
                          {`${typeof window !== 'undefined' ? window.location.origin : ''}/experiences/public/${experience.shareable_token}`}
                        </code>
                        <button 
                          className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50"
                          onClick={() => {
                            navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/experiences/public/${experience.shareable_token}`)
                          }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t p-6">
                <h3 className="text-lg font-semibold mb-3">Booking Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">Advance Notice</h4>
                    <p className="text-gray-600">{experience.booking_notice_hours || 24} hours</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Group Size</h4>
                    <p className="text-gray-600">{experience.min_group_size} to {experience.max_group_size} people</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Views</div>
                    <div className="text-2xl font-bold">{experience.view_count || 0}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Bookings</div>
                    <div className="text-2xl font-bold">{experience.booking_count || 0}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Conversion</div>
                    <div className="text-2xl font-bold">
                      {experience.view_count && experience.view_count > 0
                        ? `${((experience.booking_count || 0) / experience.view_count * 100).toFixed(1)}%`
                        : '0%'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 mb-1">Rating</div>
                    <div className="text-2xl font-bold flex items-center">
                      {experience.avg_rating 
                        ? (
                          <>
                            {experience.avg_rating.toFixed(1)}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" viewBox="0 0 24 24" stroke="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </>
                        )
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Footer Buttons */}
        <div className="flex justify-end space-x-4 pt-4">
          <Link 
            href="/experiences"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-md shadow-sm hover:bg-gray-50"
          >
            Back to Experiences
          </Link>
          <Link 
            href={`/experiences/${experience.id}/edit`}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit Experience
          </Link>
        </div>
      </div>
    </div>
  )
}
