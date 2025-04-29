import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // Create a Supabase client for route handlers (API routes)
    const supabase = await createClient();
    
    const { name, contactEmail, userId } = await request.json();
    
    if (!name || !contactEmail || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: name, contactEmail, userId' },
        { status: 400 }
      );
    }
    
    // Using the Supabase client for database operations
    const { data: newOrg, error: createOrgError } = await supabase
      .from("organizations")
      .insert({
        name,
        contact_email: contactEmail,
      })
      .select('id')
      .single();
      
    if (createOrgError) {
      console.error("Error creating organization:", createOrgError);
      return NextResponse.json(
        { error: 'Failed to create organization' },
        { status: 500 }
      );
    }
    
    // Create the organization-user relationship
    const { error: membershipError } = await supabase
      .from("organization_users")
      .insert({
        organization_id: newOrg.id,
        user_id: userId,
        role: 'owner'
      });
      
    if (membershipError) {
      console.error("Error creating organization membership:", membershipError);
      
      // Rollback organization creation
      await supabase
        .from("organizations")
        .delete()
        .eq("id", newOrg.id);
        
      return NextResponse.json(
        { error: 'Failed to create organization membership' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(newOrg);
  } catch (error) {
    console.error('Organization creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
