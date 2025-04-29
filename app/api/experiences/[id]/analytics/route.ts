import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
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
    
    // Try to get the JSON body (if any)
    let body;
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }
    
    // Create Supabase client
    const supabase = createClient()
    
    // Determine which action to take
    const action = body.action || 'view'
    
    if (action === 'view') {
      // Increment view count for the experience
      const { data, error } = await supabase.rpc(
        'increment_experience_view_count',
        { experience_id: experienceId }
      )
      
      if (error) {
        console.error('Error incrementing view count:', error)
        return NextResponse.json(
          { error: 'Failed to update view count' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'View count incremented' 
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in experience analytics API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
