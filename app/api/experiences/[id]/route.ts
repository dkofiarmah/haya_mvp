import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * API route for handling individual experience operations
 * GET: Retrieve a single experience
 * PUT: Update an experience
 * DELETE: Archive an experience (soft delete)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = createRouteHandlerClient({ cookies })
    
    // First check if this is a shareable token or a regular ID
    const { data: expByToken, error: tokenError } = await supabase
      .rpc('get_public_experience', { p_identifier: id })
      .single()
    
    if (!tokenError && expByToken) {
      // This is a public access via shareable token or slug
      return NextResponse.json({ experience: expByToken })
    }
    
    // If not found by token/slug, check for authenticated access
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Get the user's organizations
    const { data: userOrgs } = await supabase
      .from('organization_users')
      .select('organization_id')
      .eq('user_id', user.id)
    
    // Get the experience with organization data
    const { data: experience, error } = await supabase
      .from('experiences')
      .select('*, organizations(name)')
      .eq('id', id)
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    
    // Check if user has access to this organization
    const hasAccess = userOrgs?.some(org => org.organization_id === experience.org_id)
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 })
    }
    
    return NextResponse.json({ experience })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Check if experience exists and get its org_id
    const { data: existingExp, error: fetchError } = await supabase
      .from('experiences')
      .select('org_id')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingExp) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }
    
    // Check if user has access to this organization
    const { data: userOrg, error: userOrgError } = await supabase
      .from('organization_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', existingExp.org_id)
      .single()
    
    if (userOrgError || !userOrg) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 })
    }
    
    // Prepare updates
    const updates = {
      ...body,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    }
    
    // Don't allow changing org_id
    delete updates.org_id
    
    // Process array fields
    const arrayFields = ['highlights', 'included', 'not_included', 'requirements', 'languages']
    for (const field of arrayFields) {
      if (updates[field] && typeof updates[field] === 'string') {
        updates[field] = updates[field].split(',').map((item: string) => item.trim())
      }
    }
    
    // Update the experience
    const { data, error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select('id, slug, shareable_token')
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Experience updated successfully',
      experienceId: data.id,
      slug: data.slug,
      shareable_token: data.shareable_token,
      shareable_url: `/experiences/public/${data.shareable_token}`
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Check if experience exists and get its org_id
    const { data: existingExp, error: fetchError } = await supabase
      .from('experiences')
      .select('org_id')
      .eq('id', id)
      .single()
    
    if (fetchError || !existingExp) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }
    
    // Check if user has access to this organization
    const { data: userOrg, error: userOrgError } = await supabase
      .from('organization_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', existingExp.org_id)
      .single()
    
    if (userOrgError || !userOrg) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 403 })
    }
    
    // Archive the experience instead of hard delete
    const { error } = await supabase
      .from('experiences')
      .update({
        is_archived: true,
        is_active: false,
        archived_at: new Date().toISOString(),
        archived_by: user.id,
        updated_at: new Date().toISOString(),
        updated_by: user.id
      })
      .eq('id', id)
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Experience archived successfully',
      experienceId: id
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
