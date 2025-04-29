export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { useAuth } from '@/components/providers/supabase-auth-provider'

export default function OnboardingPreferencesPage() {
  const { user } = useAuth()
  
  if (!user) {
    redirect('/login')
  }

  return (
    // Your existing page content
    <div>Onboarding Preferences Page</div>
  )
}
