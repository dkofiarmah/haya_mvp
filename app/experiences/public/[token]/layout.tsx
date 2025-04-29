import '@/app/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Experience Details | Haya',
  description: 'View and book experiences with Haya',
}

export default function PublicExperienceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
      </body>
    </html>
  )
}
