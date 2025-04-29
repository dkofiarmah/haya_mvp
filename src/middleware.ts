import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

export async function middleware(req: NextRequest) {
  // Create a response early so we can modify headers
  const res = NextResponse.next()

  // Create the Supabase client
  const supabase = createMiddlewareClient<Database>({ req, res })
  
  // This is important: Wait for the session to be refreshed if needed
  await supabase.auth.getSession()

  return res
}

// Match all routes except static files and images
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
