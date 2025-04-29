import { Metadata } from 'next'
import { getExperienceById } from '@/app/actions/experiences'
import { notFound } from 'next/navigation'
import PublicExperienceView from '@/components/experiences/public-experience-view'

export const metadata: Metadata = {
  title: 'Experience | Haya',
  description: 'View travel experience details',
}

export default async function ShareablePage({ params }: { params: { token: string } }) {
  // Fetch the experience data using the shareable token
  const experience = await getExperienceById(params.token, true)
  
  // If experience not found or not shareable, show 404
  if (!experience || !experience.is_shareable) {
    notFound()
  }
  
  // Update metadata based on experience
  metadata.title = `${experience.name} | Haya`;
  metadata.description = experience.description?.substring(0, 160);
  
  return (
    <PublicExperienceView experience={experience} />
  )
}
