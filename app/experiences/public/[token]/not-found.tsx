import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ExperienceNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Experience Not Found</h1>
        <p className="text-lg text-muted-foreground">
          The experience you're looking for doesn't exist or is no longer available.
        </p>
        <div className="pt-6">
          <Button asChild>
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
