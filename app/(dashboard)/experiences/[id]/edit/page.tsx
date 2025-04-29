import { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import ExperienceFormWrapper from '@/components/experiences/experience-form-wrapper'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { getExperienceById } from '@/app/actions/experiences'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Edit Experience | Haya',
  description: 'Edit your travel experience',
}

export default async function EditExperiencePage({ params }: { params: { id: string } }) {
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
          { label: experience.name, href: `/experiences/${experience.id}` },
          { label: 'Edit Experience' }
        ]} />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Experience</h1>
          <p className="text-muted-foreground mt-1">
            Update the details of your experience.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Link 
            href={`/experiences/${experience.id}`}
            className={buttonVariants({ variant: 'outline' })}
          >
            Cancel
          </Link>
        </div>
      </div>
      
      <ExperienceFormWrapper 
        mode="edit" 
        experienceId={experience.id}
        initialData={experience}
      />
    </div>
  )
}
