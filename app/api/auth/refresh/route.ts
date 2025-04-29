import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  // Get the refresh token from the request
  const { refresh_token } = await req.json()

  if (!refresh_token) {
    return new NextResponse('Refresh token is required', { status: 400 })
  }

  const { data, error } = await supabase.auth.refreshSession({
    refresh_token,
  })

  if (error) {
    return new NextResponse(error.message, { status: 401 })
  }

  return NextResponse.json(data)
}
