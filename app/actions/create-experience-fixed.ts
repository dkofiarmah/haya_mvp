'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

// Create a new experience with manual audit logging
export async function createExperience(formData: FormData) {
  try {
    const supabase = await createServerClient()
    
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
    
    // Get the basic fields
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const location = formData.get('location') as string
    const meeting_point = formData.get('meeting_point') as string || ''
    const duration_minutes = parseInt(formData.get('duration_minutes') as string)
    const max_group_size = parseInt(formData.get('max_group_size') as string)
    const min_group_size = parseInt(formData.get('min_group_size') as string || '1')
    const price_per_person = parseFloat(formData.get('price_per_person') as string)
    const currency = formData.get('currency') as string || 'USD'
    const cancellation_policy = formData.get('cancellation_policy') as string || 'Flexible'
    
    // Process boolean flags
    const is_active = formData.get('is_active') === 'on' || formData.get('is_active') === 'true'
    const is_bookable_online = formData.get('is_bookable_online') === 'on' || formData.get('is_bookable_online') === 'true'
    const is_shareable = formData.get('is_shareable') === 'on' || formData.get('is_shareable') === 'true'
    
    // Process categories
    let categories: string[] = []
    const categoriesJson = formData.get('categories')
    if (categoriesJson && typeof categoriesJson === 'string') {
      try {
        categories = JSON.parse(categoriesJson)
      } catch (e) {
        console.error('Error parsing categories:', e)
        if (category) {
          categories = [category]
        }
      }
    } else if (category) {
      categories = [category]
    }
    
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
      tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean)
    }
    
    // Process arrays
    const highlights = formData.getAll('highlights').filter(item => item.toString().trim() !== '')
    const included = formData.getAll('included').filter(item => item.toString().trim() !== '')
    const not_included = formData.getAll('not_included').filter(item => item.toString().trim() !== '')
    const requirements = formData.getAll('requirements').filter(item => item.toString().trim() !== '')
    const languages = formData.getAll('languages').filter(item => item.toString().trim() !== '')
    
    // Process available dates (if present)
    let available_dates: any = null
    try {
      const available_dates_json = formData.get('available_dates') as string
      if (available_dates_json && available_dates_json !== '[]') {
        available_dates = JSON.parse(available_dates_json)
      }
    } catch (e) {
      console.error('Error parsing available dates:', e)
    }
    
    // Create a unique shareable token
    const shareable_token = uuidv4()
    
    // Create the experience
    const experienceId = uuidv4()
    
    // Manually create an audit log record first to ensure it exists with proper organization_id
    try {
      const { error: auditError } = await supabase
        .from('experience_audit_log')
        .insert({
          id: uuidv4(),
          experience_id: experienceId,
          organization_id: orgId,
          user_id: session.user.id,
          action_type: 'created',
          changes: {
            name,
            category,
            org_id: orgId,
            created_by: session.user.id
          }
        });
      
      if (auditError) {
        console.error('Failed to create audit log record:', auditError);
      } else {
        console.log('Successfully created audit log record for experience', experienceId);
      }
    } catch (err) {
      console.error('Error when trying to create audit log record:', err);
    }
    
    // Now insert the experience after the audit log exists
    const { error: insertError } = await supabase
      .from('experiences')
      .insert({
        id: experienceId,
        org_id: orgId,
        name,
        description,
        category,
        categories: categories || [],
        duration_minutes,
        max_group_size,
        min_group_size,
        price_per_person,
        currency,
        location,
        meeting_point,
        included: included.map(item => item.toString()),
        not_included: not_included.map(item => item.toString()),
        requirements: requirements.map(item => item.toString()),
        highlights: highlights.map(item => item.toString()),
        cancellation_policy,
        languages: languages.map(item => item.toString()),
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
      });
    
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
          cacheControl: '3600',
          upsert: true
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
        // Get image transformation URL for optimized delivery
        const optimizedUrl = `${publicUrlData.publicUrl}?width=1200&quality=80`
        imageUrls.push(optimizedUrl)
      }
    }
    
    // Update the experience with image URLs if we have any
    if (imageUrls.length > 0) {
      await supabase
        .from('experiences')
        .update({ images: imageUrls })
        .eq('id', experienceId)
    }
    
    // Revalidate and redirect
    revalidatePath('/experiences')
    redirect('/experiences')
    
    return {
      success: true,
      id: experienceId,
      shareable_url: `/experiences/public/${shareable_token}`
    }
  } catch (error) {
    console.error('Error in createExperience:', error)
    throw error
  }
}
