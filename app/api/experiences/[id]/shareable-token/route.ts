import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { regenerateShareableToken } from '@/app/actions/experience-bookings'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const experienceId = params.id
    
    if (!experienceId) {
      return NextResponse.json(
        { error: 'Missing experience ID' },
        { status: 400 }
      )
    }
    
    // Create Supabase client
    const supabase = createClient()
    
    // Check if the experience already has a shareable token
    const { data, error } = await supabase
      .from('experiences')
      .select('shareable_token, is_shareable')
      .eq('id', experienceId)
      .single()
    
    if (error) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }
    
    // If the experience is shareable and has a token, return it
    if (data.is_shareable && data.shareable_token) {
      return NextResponse.json({ token: data.shareable_token })
    }
    
    // If the experience is not shareable or doesn't have a token, generate one
    const result = await regenerateShareableToken(experienceId)
    
    if (result.success && result.token) {
      return NextResponse.json({ token: result.token })
    } else {
      return NextResponse.json(
        { error: 'Failed to generate token' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error in shareable token API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
