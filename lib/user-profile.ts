'use client'

import { supabaseClient } from '@/lib/supabase/browser'
import { User } from '@supabase/supabase-js'

/**
 * Utility functions for user profile management
 * These functions ensure proper handling of authentication and data fetching
 */

/**
 * Retrieves a user profile by ID using the authenticated Supabase client
 * This approach avoids REST API 400 errors by properly handling auth headers
 */
export async function getUserProfileById(userId: string) {
  try {
    // Use the authenticated client which will properly handle auth headers
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Exception fetching user profile:', error)
    return null
  }
}

/**
 * Retrieves the current authenticated user's profile
 * This is a safer alternative to direct API calls
 */
export async function getCurrentUserProfile() {
  try {
    // First get the authenticated user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting current user:', userError)
      return null
    }
    
    // Then get their profile
    return getUserProfileById(user.id)
  } catch (error) {
    console.error('Exception getting current user profile:', error)
    return null
  }
}

/**
 * Updates a user profile
 * This function ensures proper authentication and error handling
 */
export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error }
    }
    
    return { success: true, data }
  } catch (error) {
    console.error('Exception updating user profile:', error)
    return { success: false, error }
  }
}
