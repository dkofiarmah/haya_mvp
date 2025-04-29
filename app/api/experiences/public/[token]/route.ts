import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { v4 as uuidv4 } from 'uuid'

/**
 * API route for handling public bookings of experiences
 * GET: Get public booking information for an experience
 * POST: Create a booking for an experience
 */
export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token
    const supabase = createRouteHandlerClient({ cookies })
    
    // Find experience by shareable token or slug
    const { data: experience, error } = await supabase
      .rpc('get_public_experience', { p_identifier: token })
      .single()
    
    if (error || !experience) {
      return NextResponse.json({ error: 'Experience not found or not available for booking' }, { status: 404 })
    }
    
    // Return limited public information
    return NextResponse.json({
      experience: {
        id: experience.id,
        name: experience.name,
        description: experience.description,
        category: experience.category,
        duration_minutes: experience.duration_minutes,
        price_per_person: experience.price_per_person,
        location: experience.location,
        meeting_point: experience.meeting_point,
        min_group_size: experience.min_group_size,
        max_group_size: experience.max_group_size,
        images: experience.images,
        highlights: experience.highlights,
        included: experience.included,
        not_included: experience.not_included,
        requirements: experience.requirements,
        cancellation_policy: experience.cancellation_policy,
        languages: experience.languages,
        is_bookable_online: experience.is_bookable_online,
        booking_notice_hours: experience.booking_notice_hours
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token
    const body = await request.json()
    const supabase = createRouteHandlerClient({ cookies })
    
    // Validate required fields
    const requiredFields = [
      'booking_date', 'party_size', 'customer_name', 
      'customer_email', 'customer_phone'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` }, 
          { status: 400 }
        )
      }
    }
    
    // Find experience by shareable token or slug
    const { data: experience, error: expError } = await supabase
      .rpc('get_public_experience', { p_identifier: token })
      .single()
    
    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found or not available for booking' }, { status: 404 })
    }
    
    // Check if experience is bookable online
    if (!experience.is_bookable_online) {
      return NextResponse.json({ error: 'This experience is not available for online booking' }, { status: 400 })
    }
    
    // Calculate total price
    const totalPrice = experience.price_per_person * body.party_size
    
    // Create customer if not exists
    const customerId = uuidv4()
    const { error: customerError } = await supabase
      .from('customers')
      .insert({
        id: customerId,
        org_id: experience.org_id,
        name: body.customer_name,
        email: body.customer_email,
        phone: body.customer_phone
      })
      .select()
      .single()
    
    // If customer exists, get their ID
    let existingCustomerId = null
    if (customerError) {
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('org_id', experience.org_id)
        .eq('email', body.customer_email)
        .single()
      
      if (existingCustomer) {
        existingCustomerId = existingCustomer.id
      }
    }
    
    // Create the booking
    const bookingId = uuidv4()
    const bookingData = {
      id: bookingId,
      experience_id: experience.id,
      org_id: experience.org_id,
      customer_id: existingCustomerId || customerId,
      booking_date: body.booking_date,
      party_size: body.party_size,
      total_price: totalPrice,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      special_requests: body.special_requests || '',
      status: 'pending',
      payment_status: 'unpaid'
    }
    
    const { error: bookingError } = await supabase
      .from('experience_bookings')
      .insert(bookingData)
    
    if (bookingError) {
      return NextResponse.json({ error: `Failed to create booking: ${bookingError.message}` }, { status: 500 })
    }
    
    // Generate a payment link (placeholder - integrate with real payment provider in future)
    const paymentLink = `/payments/${bookingId}`
    
    // Update booking with payment link
    await supabase
      .from('experience_bookings')
      .update({ payment_link: paymentLink })
      .eq('id', bookingId)
    
    return NextResponse.json({
      message: 'Booking created successfully',
      bookingId,
      paymentLink,
      totalPrice
    }, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
