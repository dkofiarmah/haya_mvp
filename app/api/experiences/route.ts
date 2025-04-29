import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

/**
 * Enhanced API route for experiences, with multi-tenant support
 * GET: Retrieve experiences (with optional filters)
 * POST: Create a new experience
 * This route supports the new requirements for the experiences module
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract query parameters
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minDuration = searchParams.get('minDuration')
    const maxDuration = searchParams.get('maxDuration')
    const languages = searchParams.get('languages')
    const tags = searchParams.get('tags')
    const includeArchived = searchParams.get('includeArchived') === 'true'
    const orgId = searchParams.get('orgId')
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    
    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      // For public access, only allow limited fields for active, non-archived experiences
      let query = supabase
        .from('experiences')
        .select('id, name, description, category, duration_minutes, price_per_person, location, images, highlights, slug, shareable_token')
        .eq('is_active', true)
        .eq('is_archived', false)
      
      // Apply organization filter if provided
      if (orgId) {
        query = query.eq('org_id', orgId)
      }
      
      // Apply other filters
      if (category) query = query.eq('category', category)
      if (location) query = query.ilike('location', `%${location}%`)
      if (minPrice) query = query.gte('price_per_person', parseFloat(minPrice))
      if (maxPrice) query = query.lte('price_per_person', parseFloat(maxPrice))
      if (minDuration) query = query.gte('duration_minutes', parseInt(minDuration))
      if (maxDuration) query = query.lte('duration_minutes', parseInt(maxDuration))
      if (languages) query = query.contains('languages', languages.split(','))
      if (tags) query = query.overlaps('tags', tags.split(','))
      
      // Apply pagination
      query = query
        .order('created_at', { ascending: false })
        .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
      
      const { data, error } = await query
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ experiences: data })
    }
    
    // For authenticated users, determine which organizations they have access to
    const { data: userOrgs, error: userOrgsError } = await supabase
      .from('organization_users')
      .select('organization_id')
      .eq('user_id', user.id)
    
    if (userOrgsError) {
      return NextResponse.json({ error: 'Failed to fetch user organizations' }, { status: 500 })
    }
    
    const userOrgIds = userOrgs?.map(org => org.organization_id) || []
    
    // If orgId is provided, verify user has access
    if (orgId && !userOrgIds.includes(orgId)) {
      return NextResponse.json({ error: 'Unauthorized access to organization' }, { status: 403 })
    }
    
    // Build query based on user's access
    let query = supabase
      .from('experiences')
      .select('*, organizations(name)')
    
    // Filter by organization if provided, otherwise use all user's organizations
    if (orgId) {
      query = query.eq('org_id', orgId)
    } else {
      query = query.in('org_id', userOrgIds)
    }
    
    // Handle archive filter
    if (!includeArchived) {
      query = query.eq('is_archived', false)
    }
    
    // Apply other filters
    if (category) query = query.eq('category', category)
    if (location) query = query.ilike('location', `%${location}%`)
    if (minPrice) query = query.gte('price_per_person', parseFloat(minPrice))
    if (maxPrice) query = query.lte('price_per_person', parseFloat(maxPrice))
    if (minDuration) query = query.gte('duration_minutes', parseInt(minDuration))
    if (maxDuration) query = query.lte('duration_minutes', parseInt(maxDuration))
    if (languages) query = query.contains('languages', languages.split(','))
    if (tags) query = query.overlaps('tags', tags.split(','))
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1)
    
    const { data, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      experiences: data,
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit)
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Validate org_id is provided
    if (!body.org_id) {
      return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 })
    }
    
    // Verify user has access to this organization
    const { data: userOrgData, error: userOrgError } = await supabase
      .from('organization_users')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', body.org_id)
      .single()
      
    if (userOrgError || !userOrgData) {
      return NextResponse.json({ error: 'Unauthorized: You do not have access to this organization' }, { status: 403 })
    }
    
    // Validate required fields
    const requiredFields = [
      'name', 'description', 'category', 'duration_minutes', 
      'price_per_person', 'location', 'org_id'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` }, 
          { status: 400 }
        )
      }
    }
    
    // Process and prepare the data
    let processedData = {
      ...body,
      created_by: user.id,
      updated_by: user.id,
      shareable_token: uuidv4(),
    }
    
    // Convert string tags to array if provided as string
    if (typeof processedData.tags === 'string') {
      processedData.tags = processedData.tags.split(',').map(tag => tag.trim())
    }
    
    // Initialize array fields if not provided
    const arrayFields = ['highlights', 'included', 'not_included', 'requirements', 'languages', 'images']
    arrayFields.forEach(field => {
      if (!processedData[field]) {
        processedData[field] = []
      }
    })
    
    // Set defaults
    processedData.is_active = processedData.is_active ?? true
    processedData.is_archived = false
    processedData.is_bookable_online = processedData.is_bookable_online ?? true
    processedData.is_shareable = processedData.is_shareable ?? true
    processedData.booking_notice_hours = processedData.booking_notice_hours ?? 24
    
    // Insert experience into database
    const { data, error } = await supabase
      .from('experiences')
      .insert(processedData)
      .select('id, slug, shareable_token')
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      message: 'Experience created successfully',
      experienceId: data.id,
      slug: data.slug,
      shareable_token: data.shareable_token,
      shareable_url: `/experiences/public/${data.shareable_token}`
    }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
