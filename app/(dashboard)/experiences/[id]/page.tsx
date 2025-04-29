import { Metadata } from 'next'
import { getExperienceById } from '@/app/actions/experiences'
import { notFound } from 'next/navigation'
import ExperienceDetailView from '@/components/experiences/experience-detail-view'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Experience Details | Haya',
  description: 'View and manage travel experience details',
}

export default async function ExperiencePage({ params }: { params: { id: string } }) {
  // Fetch the experience data
  const experience = await getExperienceById(params.id)
  
  // If experience not found, show 404
  if (!experience) {
    notFound()
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Experiences', href: '/experiences' },
          { label: experience.name }
        ]} />
      </div>
      
      <ExperienceDetailView experience={experience} />
    </div>
  )
}
