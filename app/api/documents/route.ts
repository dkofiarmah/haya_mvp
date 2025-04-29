import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createServerComponentClient<Database>({ cookies })

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
