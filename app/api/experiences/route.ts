import { createRouteHandler } from '@/lib/supabase/route-handler'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import type { Database } from '@/types/supabase'

/**
 * Enhanced API route for experiences, with multi-tenant support
 * GET: Retrieve experiences (with optional filters)
 * POST: Create a new experience
 * This route supports the new requirements for the experiences module
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createRouteHandler()
    
    // Extract query parameters
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const minDuration = searchParams.get('minDuration')
    const maxDuration = searchParams.get('maxDuration')
    const orgId = searchParams.get('orgId')
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Start building the query
    let query = supabase
      .from('experiences')
      .select('*')

    // Add filters if provided
    if (category) {
      query = query.eq('category', category)
    }
    
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }
    
    if (minDuration) {
      query = query.gte('duration', parseInt(minDuration))
    }
    
    if (maxDuration) {
      query = query.lte('duration', parseInt(maxDuration))
    }

    // Filter by organization if specified
    if (orgId) {
      query = query.eq('org_id', orgId)
    }

    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching experiences:', error)
      return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in GET /api/experiences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Create Supabase client
    const supabase = createRouteHandler()
    
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
      return NextResponse.json({ error: 'User does not have access to this organization' }, { status: 403 })
    }
    
    // Create experience with UUID
    const experienceData = {
      id: uuidv4(),
      ...body,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('experiences')
      .insert(experienceData)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating experience:', error)
      return NextResponse.json({ error: 'Failed to create experience' }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/experiences:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
