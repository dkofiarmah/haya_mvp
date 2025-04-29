import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BookingNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Booking Unavailable</h1>
        <p className="text-lg text-muted-foreground">
          This experience is not available for online booking or no longer exists.
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
