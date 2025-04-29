import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Sign out user
  await supabase.auth.signOut()

  return NextResponse.json({ message: 'Signed out successfully' })
}
