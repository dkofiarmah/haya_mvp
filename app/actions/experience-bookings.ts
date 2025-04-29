'use server'

import { createDirectServerClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'

// Create a new time slot for an experience
export async function createTimeSlot(experienceId: string, data: any) {
  try {
    const supabase = await createDirectServerClient()
    
    // Generate a unique ID for the time slot
    const id = uuidv4()
    
    // Insert the time slot
    const { error } = await supabase
      .from('experience_time_slots')
      .insert({
        id,
        experience_id: experienceId,
        date: data.date,
        start_time: data.startTime,
        end_time: data.endTime,
        available_spots: data.availableSpots,
        is_active: true
      })
    
    if (error) {
      throw new Error(`Failed to create time slot: ${error.message}`)
    }
    
    revalidatePath(`/experiences/${experienceId}`)
    return { success: true, id }
  } catch (error) {
    console.error('Error in createTimeSlot:', error)
    throw error
  }
}

// Get all time slots for an experience
export async function getTimeSlotsForExperience(experienceId: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Get all active time slots for the experience, sorted by date and start time
    const { data, error } = await supabase
      .from('experience_time_slots')
      .select('*')
      .eq('experience_id', experienceId)
      .eq('is_active', true)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) {
      throw new Error(`Failed to get time slots: ${error.message}`)
    }
    
    return data || []
  } catch (error) {
    console.error('Error in getTimeSlotsForExperience:', error)
    return []
  }
}

// Delete a time slot
export async function deleteTimeSlot(id: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Delete the time slot
    const { error } = await supabase
      .from('experience_time_slots')
      .delete()
      .eq('id', id)
    
    if (error) {
      throw new Error(`Failed to delete time slot: ${error.message}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in deleteTimeSlot:', error)
    throw error
  }
}

// Regenerate a shareable token for an experience
export async function regenerateShareableToken(experienceId: string) {
  try {
    const supabase = await createDirectServerClient()
    
    // Generate a new shareable token
    const token = uuidv4()
    
    // Update the experience with the new token
    const { error } = await supabase
      .from('experiences')
      .update({ shareable_token: token })
      .eq('id', experienceId)
    
    if (error) {
      throw new Error(`Failed to regenerate token: ${error.message}`)
    }
    
    return { success: true, token }
  } catch (error) {
    console.error('Error in regenerateShareableToken:', error)
    throw error
  }
}

// Toggle whether an experience is shareable
export async function toggleExperienceShareable(experienceId: string, isShareable: boolean) {
  try {
    const supabase = await createDirectServerClient()
    
    const updates: any = { is_shareable: isShareable }
    
    // If enabling sharing and no token exists, generate one
    if (isShareable) {
      const { data } = await supabase
        .from('experiences')
        .select('shareable_token')
        .eq('id', experienceId)
        .single()
      
      if (!data?.shareable_token) {
        updates.shareable_token = uuidv4()
      }
    }
    
    // Update the experience
    const { error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', experienceId)
    
    if (error) {
      throw new Error(`Failed to update shareable status: ${error.message}`)
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in toggleExperienceShareable:', error)
    throw error
  }
}

// Create a booking for an experience
export async function createBooking(data: any) {
  try {
    const supabase = await createDirectServerClient()
    
    // Generate a unique ID and reference number for the booking
    const id = uuidv4()
    const referenceNumber = `BK-${Math.floor(100000 + Math.random() * 900000)}`
    
    // Insert the booking
    const { error } = await supabase
      .from('experience_bookings')
      .insert({
        id,
        reference_number: referenceNumber,
        experience_id: data.experienceId,
        time_slot_id: data.timeSlotId,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        num_guests: data.numGuests,
        total_price: data.totalPrice,
        currency: data.currency,
        special_requests: data.specialRequests,
        status: 'pending'
      })
    
    if (error) {
      throw new Error(`Failed to create booking: ${error.message}`)
    }
    
    // Update the available spots in the time slot
    if (data.timeSlotId) {
      const { data: timeSlot } = await supabase
        .from('experience_time_slots')
        .select('available_spots')
        .eq('id', data.timeSlotId)
        .single()
      
      if (timeSlot) {
        const newAvailableSpots = Math.max(0, timeSlot.available_spots - data.numGuests)
        
        await supabase
          .from('experience_time_slots')
          .update({ available_spots: newAvailableSpots })
          .eq('id', data.timeSlotId)
      }
    }
    
    return { success: true, referenceNumber }
  } catch (error) {
    console.error('Error in createBooking:', error)
    throw error
  }
}
