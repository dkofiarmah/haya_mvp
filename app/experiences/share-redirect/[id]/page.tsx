'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function ExperienceRedirectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  
  useEffect(() => {
    async function fetchShareableToken() {
      try {
        // Fetch the experience's shareable token
        const response = await fetch(`/api/experiences/${params.id}/shareable-token`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch shareable token')
        }
        
        const data = await response.json()
        
        if (data.token) {
          // Redirect to the public experience page
          router.push(`/experiences/public/${data.token}`)
        } else {
          // If no token is available, redirect to experiences list
          router.push('/experiences')
        }
      } catch (error) {
        console.error('Error fetching shareable token:', error)
        router.push('/experiences')
      }
    }
    
    fetchShareableToken()
  }, [params.id, router])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>Redirecting to experience page...</p>
      </div>
    </div>
  )
}
