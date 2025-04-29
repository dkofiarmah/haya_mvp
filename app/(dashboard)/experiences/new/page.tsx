import { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import ExperienceFormWrapper from '@/components/experiences/experience-form-wrapper'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Create Experience | Haya',
  description: 'Create a new travel experience',
}

export default function NewExperiencePage() {
  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Breadcrumb items={[
          { label: 'Dashboard', href: '/' },
          { label: 'Experiences', href: '/experiences' },
          { label: 'Create New Experience' }
        ]} />
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Experience</h1>
          <p className="text-muted-foreground mt-1">
            Add a new experience to your catalog for your customers to book.
          </p>
        </div>
        <Link 
          href="/experiences" 
          className={`${buttonVariants({ variant: 'outline' })} mt-4 md:mt-0`}
        >
          Back to Experiences
        </Link>
      </div>
      
      <ExperienceFormWrapper mode="create" />
      <div className="text-sm text-muted-foreground mt-4">
        <p>
          By creating an experience, you agree to our{' '}
          <Link href="/terms" className="text-blue-500 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy
          </Link>.
        </p>
    </div>
    </div>
  )
}