import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

/**
 * API route for enhancing experience descriptions with AI
 * POST: Enhance an experience description using AI
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { description, experienceType } = body
    
    // Validate input
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 })
    }
    
    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
    
    // Define prompt for AI
    const prompt = `You are an expert travel copywriter. Enhance the following tour experience description 
    to make it more engaging, descriptive, and appealing to potential customers.
    
    Experience type: ${experienceType || 'Travel Experience'}
    
    Original description:
    "${description}"
    
    Please create an enhanced version that:
    1. Uses vivid, sensory language
    2. Highlights unique features and benefits
    3. Creates a sense of place and atmosphere
    4. Uses active voice and engaging tone
    5. Is well-structured with logical flow
    6. Is suitable for marketing materials
    
    Enhanced description:`;
    
    // In a real implementation, this would call an AI service like OpenAI
    // For now, we'll mock a response with a better version of whatever is input
    
    let enhancedDescription = '';
    
    // Simple mock enhancement
    if (description) {
      // Split into paragraphs
      const paragraphs = description.split(/\n+/);
      
      // Process each paragraph
      enhancedDescription = paragraphs.map(para => {
        if (!para.trim()) return '';
        
        // Add more vivid adjectives
        const enhanced = para
          .replace(/nice/gi, 'breathtaking')
          .replace(/good/gi, 'exceptional')
          .replace(/see/gi, 'discover')
          .replace(/beautiful/gi, 'stunning')
          .replace(/great/gi, 'extraordinary');
          
        // Add a more engaging sentence structure
        return enhanced + (enhanced.endsWith('.') ? '' : '.') + 
          ' Experience the wonder of this unforgettable adventure that will leave you with memories to cherish for a lifetime.';
      }).join('\n\n');
      
      // Add a strong intro if the description is short
      if (description.length < 100) {
        enhancedDescription = `Embark on an extraordinary journey into the heart of adventure! ${enhancedDescription}`;
      }
      
      // Add a compelling closing
      enhancedDescription += '\n\nBook now to secure your place on this remarkable experience that perfectly balances adventure, culture, and authentic local engagement.';
    }
    
    return NextResponse.json({ 
      enhanced_description: enhancedDescription || 'Unable to enhance the provided description.'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
