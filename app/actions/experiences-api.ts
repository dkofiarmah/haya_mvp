'use server'

import { createDirectServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

// Types for Experience entity
export interface Experience {
  id: string
  org_id: string
  name: string
  description: string
  category: string
  duration_minutes: number
  max_group_size: number
  min_group_size: number
  price_per_person: number
  currency: string
  location: string
  coordinates?: { lat: number, lng: number }
  meeting_point?: string
  included?: string[]
  not_included?: string[]
  requirements?: string[]
  highlights?: string[]
  cancellation_policy?: string
  languages?: string[]
  tags?: string[]
  images?: string[]
  is_active: boolean
  is_archived: boolean
  is_bookable_online: boolean
  is_shareable: boolean
  booking_notice_hours?: number
  available_dates?: string[]
  view_count?: number
  booking_count?: number
  avg_rating?: number
  total_reviews?: number
  shareable_token?: string
  shareable_url?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  slug?: string
}

// Define filters for listing experiences
export interface ExperienceFilters {
  orgId?: string | null
  includeArchived?: boolean
  category?: string | null
  searchTerm?: string | null
  tags?: string[] | null
  minPrice?: number | null
  maxPrice?: number | null
  sortBy?: string
  sortDirection?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// Get all experiences with filtering and pagination
export async function getExperiences({
  orgId = null,
  includeArchived = false,
  category = null,
  searchTerm = null,
  tags = null,
  minPrice = null,
  maxPrice = null,
  sortBy = 'created_at',
  sortDirection = 'desc',
  page = 0,
  pageSize = 10
}: ExperienceFilters = {}) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get user's auth info
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no specific org is provided and user is authenticated, get their orgs
    let userOrgIds: string[] = []
    if (!orgId && session?.user) {
      const { data: userOrgs } = await supabase
        .from('organization_users')
        .select('organization_id')
        .eq('user_id', session.user.id)
      
      userOrgIds = userOrgs?.map(org => org.organization_id) || []
    }
    
    // Start building the query
    let query = supabase
      .from('experiences')
      .select('*, organizations(name)')
    
    // Filter by organization
    if (orgId) {
      query = query.eq('org_id', orgId)
    } else if (userOrgIds.length > 0) {
      query = query.in('org_id', userOrgIds)
    } else if (session?.user) {
      // Fallback to the first organization if we couldn't determine user orgs
      const { data: orgs } = await supabase
        .from('organizations')
        .select('id')
        .limit(1)
      
      if (orgs && orgs.length > 0) {
        query = query.eq('org_id', orgs[0].id)
      }
    }
    
    // Filter archived status
    if (!includeArchived) {
      query = query.eq('is_archived', false)
    }
    
    // Apply category filter if provided
    if (category) {
      query = query.eq('category', category)
    }
    
    // Apply search filter if provided
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
    }
    
    // Apply tags filter if provided
    if (tags && tags.length > 0) {
      query = query.contains('tags', tags)
    }
    
    // Apply price range filters if provided
    if (minPrice !== null) {
      query = query.gte('price_per_person', minPrice)
    }
    if (maxPrice !== null) {
      query = query.lte('price_per_person', maxPrice)
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortDirection === 'asc' })
    
    // Apply pagination
    const from = page * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)
    
    // Execute the query
    const { data, error } = await query
    
    if (error) {
      throw new Error(`Failed to fetch experiences: ${error.message}`)
    }
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('experiences')
      .select('id', { count: 'exact', head: true })
      .eq('is_archived', false)
    
    if (countError) {
      console.error('Error counting experiences:', countError)
    }
    
    return {
      experiences: data || [],
      pagination: {
        total: totalCount || 0,
        page,
        pageSize,
        pages: Math.ceil((totalCount || 0) / pageSize)
      }
    }
  } catch (error) {
    console.error('Error in getExperiences:', error)
    return { experiences: [], pagination: { total: 0, page: 0, pageSize: 10, pages: 0 } }
  }
}

// Get a single experience by ID, slug, or token
export async function getExperienceById(identifier: string, isPublic: boolean = false) {
  try {
    const supabase = await createDirectServerClient()
    
    // Different behavior based on public vs. authenticated access
    if (isPublic) {
      // For public access, try to find by slug or shareable token
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .or(`slug.eq.${identifier},shareable_token.eq.${identifier}`)
        .eq('is_active', true)
        .eq('is_archived', false)
        .single()
      
      if (error) {
        console.error(`Failed to fetch public experience: ${error.message}`)
        return null
      }
      
      // Increment view count
      await supabase.rpc('increment_experience_view_count', { experience_id: data.id })
      
      return data
    } else {
      // For authenticated access, do standard lookup with org data
      const { data, error } = await supabase
        .from('experiences')
        .select('*, organizations(name)')
        .eq('id', identifier)
        .single()
      
      if (error) {
        // If not found by ID, try slug
        const { data: dataBySlug, error: slugError } = await supabase
          .from('experiences')
          .select('*, organizations(name)')
          .eq('slug', identifier)
          .single()
        
        if (slugError) {
          console.error(`Failed to fetch experience: ${error.message}`)
          return null
        }
        
        return dataBySlug
      }
      
      return data
    }
  } catch (error) {
    console.error('Error in getExperienceById:', error)
    return null
  }
}

// Create a new experience
export async function createExperience(formData: FormData) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Authentication required')
    }
    
    // Get organization ID from form data or user's primary organization
    let orgId = formData.get('org_id') as string
    
    if (!orgId) {
      // Get user's organization
      const { data: userOrgs } = await supabase
        .from('organization_users')
        .select('organization_id')
        .eq('user_id', session.user.id)
        .limit(1)
      
      if (userOrgs && userOrgs.length > 0) {
        orgId = userOrgs[0].organization_id
      } else {
        // Fallback to first organization if needed
        const { data: orgs } = await supabase
          .from('organizations')
          .select('id')
          .limit(1)
        
        if (!orgs || orgs.length === 0) {
          throw new Error('No organizations found')
        }
        
        orgId = orgs[0].id
      }
    }
    
    // Process form data for basic fields
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const location = formData.get('location') as string
    const duration_minutes = parseInt(formData.get('duration_minutes') as string)
    const max_group_size = parseInt(formData.get('max_group_size') as string)
    const min_group_size = parseInt(formData.get('min_group_size') as string || '1')
    const price_per_person = parseFloat(formData.get('price_per_person') as string)
    const currency = formData.get('currency') as string || 'USD'
    const cancellation_policy = formData.get('cancellation_policy') as string || 'Flexible'
    const meeting_point = formData.get('meeting_point') as string || ''
    
    // Process boolean flags
    const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true'
    const is_bookable_online = formData.get('is_bookable_online') === 'on' || formData.get('is_bookable_online') === 'true'
    const is_shareable = formData.get('is_shareable') === 'on' || formData.get('is_shareable') === 'true'
    
    // Process booking settings
    let booking_notice_hours = 24; // Default value
    try {
      const notice_hours_str = formData.get('booking_notice_hours');
      if (notice_hours_str) {
        booking_notice_hours = parseInt(notice_hours_str.toString());
        if (isNaN(booking_notice_hours)) {
          booking_notice_hours = 24; // Fall back to default if parsing fails
        }
      }
    } catch (e) {
      console.error('Error parsing booking_notice_hours:', e);
    }
    
    // Process tags as comma-separated string
    let tags: string[] = []
    const tagsString = formData.get('tags') as string
    if (tagsString) {
      tags = tagsString.split(',').map(tag => tag.trim())
    }
    
    // Process arrays
    const included = formData.getAll('included').map(item => item.toString()).filter(item => item.trim() !== '')
    const not_included = formData.getAll('not_included').map(item => item.toString()).filter(item => item.trim() !== '')
    const requirements = formData.getAll('requirements').map(item => item.toString()).filter(item => item.trim() !== '')
    const highlights = formData.getAll('highlights').map(item => item.toString()).filter(item => item.trim() !== '')
    const languages = formData.getAll('languages').map(item => item.toString()).filter(item => item.trim() !== '')
    
    // Process available dates (if present)
    let available_dates = []
    try {
      const available_dates_json = formData.get('available_dates') as string
      if (available_dates_json) {
        available_dates = JSON.parse(available_dates_json)
      }
    } catch (e) {
      console.error('Error parsing available dates:', e)
    }
    
    // Process coordinates if available
    let coordinates = null
    const lat = formData.get('lat')
    const lng = formData.get('lng')
    if (lat && lng) {
      coordinates = { lat: parseFloat(lat as string), lng: parseFloat(lng as string) }
    }
    
    // Create a unique shareable token
    const shareable_token = uuidv4()
    
    // Create the experience
    const experienceId = uuidv4()
    const { error: insertError } = await supabase
      .from('experiences')
      .insert({
        id: experienceId,
        org_id: orgId,
        name,
        description,
        category,
        duration_minutes,
        max_group_size,
        min_group_size,
        price_per_person,
        currency,
        location,
        coordinates,
        meeting_point,
        included,
        not_included,
        requirements,
        highlights,
        cancellation_policy,
        languages,
        tags,
        is_active,
        is_archived: false,
        is_bookable_online,
        is_shareable,
        booking_notice_hours,
        available_dates,
        shareable_token,
        created_by: session.user.id,
        updated_by: session.user.id
      })
    
    if (insertError) {
      throw new Error(`Failed to create experience: ${insertError.message}`)
    }
    
    // Handle image uploads
    const imageUrls: string[] = []
    const imageFiles = formData.getAll('images') as File[]
    const validImageFiles = imageFiles.filter(file => file instanceof File && file.size > 0)
    
    for (const file of validImageFiles) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `experiences/${experienceId}/${fileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('experience-images')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600'
        })
      
      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        continue
      }
      
      // Get the public URL for the image
      const { data: publicUrlData } = supabase.storage
        .from('experience-images')
        .getPublicUrl(filePath)
      
      if (publicUrlData) {
        imageUrls.push(publicUrlData.publicUrl)
      }
    }
    
    // Update the experience with image URLs if we have any
    if (imageUrls.length > 0) {
      await supabase
        .from('experiences')
        .update({ images: imageUrls })
        .eq('id', experienceId)
    }
    
    // Log the creation in audit trail
    await logExperienceAction(experienceId, 'created')
    
    // Get the slug and shareable link for the response
    const { data: experience } = await supabase
      .from('experiences')
      .select('slug, shareable_token')
      .eq('id', experienceId)
      .single()
    
    const result = {
      success: true,
      id: experienceId,
      slug: experience?.slug,
      shareable_token: experience?.shareable_token,
      shareable_url: experience ? `/experiences/public/${experience.shareable_token}` : null
    }
    
    revalidatePath('/experiences')
    redirect('/experiences')
    
    return result
  } catch (error) {
    console.error('Error in createExperience:', error)
    throw error
  }
}

// Update an existing experience
export async function updateExperience(id: string, formData: FormData) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Authentication required')
    }
    
    // Build the updates object from form data
    const updates: any = {
      updated_by: session.user.id,
      updated_at: new Date().toISOString()
    }
    
    if (formData.has('name')) updates.name = formData.get('name')
    if (formData.has('description')) updates.description = formData.get('description')
    if (formData.has('category')) updates.category = formData.get('category')
    if (formData.has('location')) updates.location = formData.get('location')
    if (formData.has('duration_minutes')) updates.duration_minutes = parseInt(formData.get('duration_minutes') as string)
    if (formData.has('max_group_size')) updates.max_group_size = parseInt(formData.get('max_group_size') as string)
    if (formData.has('min_group_size')) updates.min_group_size = parseInt(formData.get('min_group_size') as string)
    if (formData.has('price_per_person')) updates.price_per_person = parseFloat(formData.get('price_per_person') as string)
    if (formData.has('currency')) updates.currency = formData.get('currency')
    if (formData.has('cancellation_policy')) updates.cancellation_policy = formData.get('cancellation_policy')
    if (formData.has('meeting_point')) updates.meeting_point = formData.get('meeting_point')
    
    // Process boolean flags
    if (formData.has('is_active')) updates.is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true'
    if (formData.has('is_bookable_online')) updates.is_bookable_online = formData.get('is_bookable_online') === 'on' || formData.get('is_bookable_online') === 'true'
    if (formData.has('is_shareable')) updates.is_shareable = formData.get('is_shareable') === 'on' || formData.get('is_shareable') === 'true'
    
    // Process booking settings
    if (formData.has('booking_notice_hours')) {
      try {
        const noticeHoursValue = formData.get('booking_notice_hours')?.toString();
        const parsedValue = parseInt(noticeHoursValue || '24');
        updates.booking_notice_hours = isNaN(parsedValue) ? 24 : parsedValue;
      } catch (e) {
        console.error('Error parsing booking_notice_hours:', e);
        updates.booking_notice_hours = 24; // Default value
      }
    }
    
    // Process tags as comma-separated string
    if (formData.has('tags')) {
      const tagsString = formData.get('tags') as string
      updates.tags = tagsString.split(',').map(tag => tag.trim())
    }
    
    // Process arrays
    if (formData.has('included')) updates.included = formData.getAll('included').map(item => item.toString()).filter(item => item.trim() !== '')
    if (formData.has('not_included')) updates.not_included = formData.getAll('not_included').map(item => item.toString()).filter(item => item.trim() !== '')
    if (formData.has('requirements')) updates.requirements = formData.getAll('requirements').map(item => item.toString()).filter(item => item.trim() !== '')
    if (formData.has('highlights')) updates.highlights = formData.getAll('highlights').map(item => item.toString()).filter(item => item.trim() !== '')
    if (formData.has('languages')) updates.languages = formData.getAll('languages').map(item => item.toString()).filter(item => item.trim() !== '')
    
    // Process available dates (if present)
    if (formData.has('available_dates')) {
      try {
        const available_dates_json = formData.get('available_dates') as string
        if (available_dates_json) {
          updates.available_dates = JSON.parse(available_dates_json)
        }
      } catch (e) {
        console.error('Error parsing available dates:', e)
      }
    }
    
    // Process coordinates if available
    const lat = formData.get('lat')
    const lng = formData.get('lng')
    if (lat && lng) {
      updates.coordinates = { lat: parseFloat(lat as string), lng: parseFloat(lng as string) }
    }
    
    // Handle image uploads
    const imageFiles = formData.getAll('images') as File[]
    const validImageFiles = imageFiles.filter(file => file instanceof File && file.size > 0)
    
    if (validImageFiles.length > 0) {
      const imageUrls: string[] = []
      
      // Get existing images first
      const { data: existingData } = await supabase
        .from('experiences')
        .select('images')
        .eq('id', id)
        .single()
      
      if (existingData?.images) {
        imageUrls.push(...existingData.images)
      }
      
      for (const file of validImageFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `experiences/${id}/${fileName}`
        
        const { error: uploadError } = await supabase.storage
          .from('experience-images')
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600'
          })
        
        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          continue
        }
        
        // Get the public URL for the image
        const { data: publicUrlData } = supabase.storage
          .from('experience-images')
          .getPublicUrl(filePath)
        
        imageUrls.push(publicUrlData.publicUrl)
      }
      
      updates.images = imageUrls
    }
    
    // Update the experience
    const { error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to update experience: ${error.message}`)
    }
    
    // Log the update in audit trail
    await logExperienceAction(id, 'updated')
    
    revalidatePath(`/experiences/${id}`)
    revalidatePath('/experiences')
    
    return { success: true, id }
  } catch (error) {
    console.error('Error in updateExperience:', error)
    throw error
  }
}

// Archive an experience (soft delete)
export async function archiveExperience(id: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Authentication required')
    }
    
    // Archive the experience
    const { error } = await supabase
      .from('experiences')
      .update({ 
        is_archived: true,
        is_active: false,
        archived_at: new Date().toISOString(),
        archived_by: session.user.id,
        updated_by: session.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to archive experience: ${error.message}`)
    }
    
    // Log the archiving in audit trail
    await logExperienceAction(id, 'archived')
    
    revalidatePath('/experiences')
    return { success: true }
  } catch (error) {
    console.error('Error in archiveExperience:', error)
    throw error
  }
}

// Restore an archived experience
export async function restoreExperience(id: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Authentication required')
    }
    
    // Restore the experience
    const { error } = await supabase
      .from('experiences')
      .update({ 
        is_archived: false,
        archived_at: null,
        archived_by: null,
        updated_by: session.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to restore experience: ${error.message}`)
    }
    
    // Log the restoration in audit trail
    await logExperienceAction(id, 'restored')
    
    revalidatePath('/experiences')
    return { success: true }
  } catch (error) {
    console.error('Error in restoreExperience:', error)
    throw error
  }
}

// Delete an experience (hard delete - use with caution)
export async function deleteExperience(id: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Authentication required')
    }
    
    // Delete the associated images from storage first
    await supabase.storage
      .from('experience-images')
      .remove([`experiences/${id}`])
    
    // Delete the experience from the database
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to delete experience: ${error.message}`)
    }
    
    revalidatePath('/experiences')
    return { success: true }
  } catch (error) {
    console.error('Error in deleteExperience:', error)
    throw error
  }
}

// Duplicate an experience
export async function duplicateExperience(id: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Authentication required')
    }
    
    // Get the experience to duplicate
    const { data: originalExperience, error: fetchError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()
    
    if (fetchError || !originalExperience) {
      throw new Error(`Failed to fetch experience: ${fetchError?.message || 'Not found'}`)
    }
    
    // Create a new ID for the duplicate
    const newId = uuidv4()
    const shareable_token = uuidv4()
    
    // Copy all fields except id and append "Copy" to the name
    const duplicateExperience = {
      ...originalExperience,
      id: newId,
      name: `${originalExperience.name} (Copy)`,
      is_active: false, // Start as inactive
      shareable_token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: session.user.id,
      updated_by: session.user.id
    }
    
    // Remove fields that should not be duplicated
    delete duplicateExperience.slug
    delete duplicateExperience.view_count
    delete duplicateExperience.booking_count
    delete duplicateExperience.avg_rating
    delete duplicateExperience.total_reviews
    
    // Insert the duplicate
    const { error: insertError } = await supabase
      .from('experiences')
      .insert(duplicateExperience)
    
    if (insertError) {
      throw new Error(`Failed to duplicate experience: ${insertError.message}`)
    }
    
    // Duplicate images if any
    if (originalExperience.images && originalExperience.images.length > 0) {
      const imageUrls: string[] = []
      
      for (const imageUrl of originalExperience.images) {
        // Extract the file path from the URL
        const urlParts = imageUrl.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const sourcePath = `experiences/${id}/${fileName}`
        const destPath = `experiences/${newId}/${fileName}`
        
        // Copy the file in storage
        const { error: copyError } = await supabase.storage
          .from('experience-images')
          .copy(sourcePath, destPath)
        
        if (copyError) {
          console.error('Error copying image:', copyError)
          continue
        }
        
        // Get the public URL for the image
        const { data: publicUrlData } = supabase.storage
          .from('experience-images')
          .getPublicUrl(destPath)
        
        imageUrls.push(publicUrlData.publicUrl)
      }
      
      // Update the duplicate with the image URLs
      if (imageUrls.length > 0) {
        await supabase
          .from('experiences')
          .update({ images: imageUrls })
          .eq('id', newId)
      }
    }
    
    // Log the duplication in audit trail
    await logExperienceAction(newId, 'created_from_duplicate', { source_id: id })
    
    revalidatePath('/experiences')
    return { success: true, newId }
  } catch (error) {
    console.error('Error in duplicateExperience:', error)
    throw error
  }
}

// Toggle experience active status
export async function toggleExperienceStatus(id: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      throw new Error('Authentication required')
    }
    
    // First, get the current status
    const { data: experience, error: fetchError } = await supabase
      .from('experiences')
      .select('is_active')
      .eq('id', id)
      .single()
    
    if (fetchError || !experience) {
      throw new Error(`Failed to fetch experience: ${fetchError?.message || 'Not found'}`)
    }
    
    // Toggle the status
    const { error } = await supabase
      .from('experiences')
      .update({ 
        is_active: !experience.is_active,
        updated_by: session.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to update experience status: ${error.message}`)
    }
    
    // Log the status change in audit trail
    await logExperienceAction(id, !experience.is_active ? 'activated' : 'deactivated')
    
    revalidatePath(`/experiences/${id}`)
    revalidatePath('/experiences')
    
    return { success: true, is_active: !experience.is_active }
  } catch (error) {
    console.error('Error in toggleExperienceStatus:', error)
    throw error
  }
}

// Get experience categories
export async function getExperienceCategories() {
  try {
    const supabase = await createDirectServerClient()
    
    const { data, error } = await supabase
      .from('experience_categories')
      .select('*')
      .order('name')
    
    if (error) {
      throw new Error(`Failed to fetch experience categories: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getExperienceCategories:', error)
    return []
  }
}

// Get experience shareable link
export async function getExperienceShareableLink(id: string) {
  try {
    const supabase = await createDirectServerClient()
    
    const { data, error } = await supabase
      .from('experiences')
      .select('shareable_token')
      .eq('id', id)
      .single()
    
    if (error || !data) {
      throw new Error(`Failed to fetch experience shareable token: ${error?.message || 'Not found'}`)
    }
    
    return {
      success: true,
      token: data.shareable_token,
      url: `/experiences/public/${data.shareable_token}`
    }
  } catch (error) {
    console.error('Error in getExperienceShareableLink:', error)
    throw error
  }
}

// Log experience action for audit trail
export async function logExperienceAction(experienceId: string, action: string, metadata: any = {}) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get current authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      return // Silent fail if no auth
    }
    
    await supabase
      .from('experience_audit_log')
      .insert({
        experience_id: experienceId,
        user_id: session.user.id,
        action_type: action,
        changes: metadata
      })
  } catch (error) {
    console.error('Error logging experience action:', error)
  }
}
