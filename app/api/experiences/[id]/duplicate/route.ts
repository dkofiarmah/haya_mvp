import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logExperienceAction } from '@/app/actions/experience-audit'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const supabase = await createClient()
    
    // Get the experience to duplicate
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      )
    }
    
    // Create a new ID for the duplicated experience
    const newId = uuidv4()
    
    // Generate a new shareable token
    const shareable_token = uuidv4()
    
    // Modify the experience data for the duplicate
    const duplicateData = {
      ...experience,
      id: newId,
      name: `${experience.name} (Copy)`,
      is_active: false, // Start as inactive
      shareable_token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0,
      booking_count: 0
    }
    
    // Remove any stats or unique fields that shouldn't be copied
    delete duplicateData.avg_rating
    delete duplicateData.total_reviews
    
    // Insert the duplicate experience
    const { error: insertError } = await supabase
      .from('experiences')
      .insert(duplicateData)
    
    if (insertError) {
      return NextResponse.json(
        { error: `Failed to duplicate experience: ${insertError.message}` },
        { status: 500 }
      )
    }
    
    // Log the duplication action
    await logExperienceAction(id, 'updated', { 
      action: 'duplicated',
      duplicate_id: newId
    })
    
    // Also log creation of the new experience
    await logExperienceAction(newId, 'created', {
      duplicated_from: id
    })
    
    return NextResponse.json({
      success: true,
      id: newId,
      message: 'Experience duplicated successfully'
    })
  } catch (error) {
    console.error('Error duplicating experience:', error)
    return NextResponse.json(
      { error: 'Failed to duplicate experience' },
      { status: 500 }
    )
  }
}
