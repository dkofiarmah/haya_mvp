import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PublicExperienceView from '@/components/experiences/public-experience-view'
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
    .select('name, description')
    .eq('shareable_token', token)
    .eq('is_shareable', true)
    .eq('is_archived', false)
    .single()
  
  if (!experience) {
    return {
      title: 'Experience Not Found | Haya',
      description: 'The requested experience could not be found or is no longer available.'
    }
  }
  
  return {
    title: `${experience.name} | Haya`,
    description: experience.description.substring(0, 160)
  }
}

export default async function PublicExperiencePage({ params }: PageParams) {
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
    .eq('is_archived', false)
    .single()
  
  if (error || !experience) {
    console.error('Error fetching experience:', error)
    notFound()
  }
  
  // Track view
  try {
    await supabase.rpc('increment_experience_view_count', { 
      experience_id: experience.id 
    })
  } catch (err) {
    console.error('Error incrementing view count:', err)
    // Continue even if tracking fails
  }
  
  // Log view in audit logs
  try {
    await supabase.from('experience_audit_logs').insert({
      experience_id: experience.id,
      action_type: 'viewed',
      user_id: '00000000-0000-0000-0000-000000000000', // System user for anonymous view
    })
  } catch (err) {
    console.error('Error logging view:', err)
    // Continue even if logging fails
  }
  
  return <PublicExperienceView experience={experience} />
}
