import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicBookingForm from '@/components/experiences/public-booking-form'
import { Metadata } from 'next'

type PageParams = {
  params: {
    token: string
  }
}

// Export dynamic metadata
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { token } = params
  const supabase = await createClient()
  
  // Get experience details for metadata
  const { data: experience } = await supabase
    .from('experiences')
    .select('name')
    .eq('shareable_token', token)
    .eq('is_shareable', true)
    .eq('is_bookable_online', true)
    .eq('is_archived', false)
    .single()
  
  if (!experience) {
    return {
      title: 'Experience Not Found | Haya',
      description: 'The requested experience could not be found or is no longer available for booking.'
    }
  }
  
  return {
    title: `Book ${experience.name} | Haya`,
    description: `Book your spot for ${experience.name} now.`
  }
}

export default async function PublicBookingPage({ params }: PageParams) {
  const { token } = params
  const supabase = await createClient()
  
  // Get experience details
  const { data: experience, error } = await supabase
    .from('experiences')
    .select(`
      *,
      organizations (
        id,
        name,
        slug
      )
    `)
    .eq('shareable_token', token)
    .eq('is_shareable', true)
    .eq('is_bookable_online', true)
    .eq('is_archived', false)
    .single()
  
  if (error || !experience) {
    console.error('Error fetching experience:', error)
    notFound()
  }
  
  return <PublicBookingForm experience={experience} />
}
