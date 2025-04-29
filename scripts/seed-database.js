/**
 * Database Seed Script for Haya MVP
 * 
 * This script seeds the Supabase database with sample data for testing.
 * Run using: node scripts/seed-database.js
 * 
 * Make sure to set the SUPABASE_URL and SUPABASE_KEY environment variables
 * or create a .env file with these values.
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data
const sampleData = {
  // Sample organization
  organization: {
    name: 'Adventure Tours Inc.',
    slug: 'adventure-tours',
    description: 'Leading provider of adventure tours and experiences',
    website: 'https://example.com',
    contact_email: 'contact@example.com',
    contact_phone: '+1-555-123-4567',
    subscription_status: 'active',
    subscription_tier: 'professional',
    trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { 
      founded: '2010',
      headquarters: 'Seattle, WA',
      employees: 25
    }
  },

  // Sample user
  user: {
    email: 'admin@example.com',
    full_name: 'Admin User',
    avatar_url: 'https://randomuser.me/api/portraits/men/1.jpg',
    onboarding_completed: true,
    preferences: {
      notifications: {
        email: true,
        push: true
      },
      theme: 'light'
    }
  },

  // Sample tours
  tours: [
    {
      title: 'Mountain Expedition',
      description: 'A thrilling 5-day mountain climbing experience for adventurous souls',
      itinerary_json: {
        days: [
          {
            day: 1,
            title: 'Arrival and Orientation',
            description: 'Welcome meeting, gear check, and orientation',
            activities: ['Welcome dinner', 'Safety briefing', 'Equipment check']
          },
          {
            day: 2,
            title: 'Base Camp Hike',
            description: 'Hiking to base camp and acclimatization',
            activities: ['Morning yoga', '6-hour hike', 'Base camp setup']
          },
          {
            day: 3,
            title: 'Summit Preparation',
            description: 'Technical training and preparation for summit attempt',
            activities: ['Climbing techniques', 'Weather briefing', 'Early rest']
          },
          {
            day: 4,
            title: 'Summit Day',
            description: 'Early morning start for summit attempt',
            activities: ['Summit climb', 'Photography session', 'Celebration']
          },
          {
            day: 5,
            title: 'Descent and Departure',
            description: 'Return to civilization and farewell',
            activities: ['Descent hike', 'Closing ceremony', 'Departure transfers']
          }
        ]
      },
      images: [
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99'
      ],
      duration: '5 days',
      base_price: 1299.99,
      location: 'Alps, Switzerland',
      tags: ['mountain', 'climbing', 'adventure', 'hiking'],
      max_participants: 12,
      is_published: true,
      metadata: {
        difficulty: 'Advanced',
        altitude: '4,500m',
        best_season: 'Summer'
      }
    },
    {
      title: 'Coastal Paradise Tour',
      description: 'Explore stunning coastlines and hidden beaches on this relaxing 7-day tour',
      itinerary_json: {
        days: [
          {
            day: 1,
            title: 'Arrival and Beach Welcome',
            description: 'Airport pickup and beach welcome party',
            activities: ['Airport transfer', 'Welcome cocktail', 'Sunset dinner']
          },
          {
            day: 2,
            title: 'Hidden Coves Exploration',
            description: 'Boat tour to discover secluded beaches and coves',
            activities: ['Breakfast', 'Boat tour', 'Snorkeling', 'Beach picnic']
          },
          // Additional days simplified for brevity
          {
            day: 7,
            title: 'Farewell',
            description: 'Final day with farewell activities',
            activities: ['Sunrise yoga', 'Farewell brunch', 'Airport transfers']
          }
        ]
      },
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206'
      ],
      duration: '7 days',
      base_price: 1599.99,
      location: 'Bali, Indonesia',
      tags: ['beach', 'relaxation', 'snorkeling', 'island'],
      max_participants: 16,
      is_published: true,
      metadata: {
        difficulty: 'Easy',
        accommodation: '4-star resort',
        meals: 'Full board'
      }
    }
  ],

  // Sample customers
  customers: [
    {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-987-6543',
      address: '123 Main St, Seattle, WA 98101',
      preferences: {
        dietary: ['vegetarian'],
        accommodation: 'private room',
        activities: ['hiking', 'photography']
      },
      tags: ['frequent', 'premium'],
      metadata: {
        referral_source: 'website',
        lifetime_value: 4500
      }
    },
    {
      name: 'Emma Johnson',
      email: 'emma.j@example.com',
      phone: '+1-555-123-7890',
      address: '456 Pine Ave, Portland, OR 97204',
      preferences: {
        dietary: ['gluten-free'],
        accommodation: 'shared',
        activities: ['swimming', 'yoga']
      },
      tags: ['new', 'family'],
      metadata: {
        referral_source: 'instagram',
        family_members: 3
      }
    },
    {
      name: 'Michael Chen',
      email: 'mchen@example.com',
      phone: '+1-555-234-5678',
      address: '789 Oak Blvd, San Francisco, CA 94107',
      preferences: {
        dietary: ['no restrictions'],
        accommodation: 'luxury',
        activities: ['climbing', 'kayaking']
      },
      tags: ['premium', 'adventure'],
      metadata: {
        referral_source: 'friend',
        lifetime_value: 7200
      }
    }
  ],

  // Sample experiences
  experiences: [
    {
      name: 'Sunrise Mountain Yoga',
      description: 'Experience sunrise yoga on a mountain peak with breathtaking views',
      location: 'Mount Serenity, Alps',
      duration: '3 hours',
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        'https://images.unsplash.com/photo-1545389336-cf090694435e'
      ],
      tags: ['yoga', 'wellness', 'mountain', 'sunrise'],
      pricing: {
        base: 45.00,
        group_discount: 0.15,
        private_session: 120.00
      },
      is_active: true,
      metadata: {
        difficulty: 'Moderate',
        equipment_provided: true,
        instructor: 'Sarah Williams'
      }
    },
    {
      name: 'Local Cuisine Cooking Class',
      description: 'Learn to prepare authentic local dishes with expert chefs',
      location: 'Downtown Culinary Center',
      duration: '4 hours',
      images: [
        'https://images.unsplash.com/photo-1556911220-bff31c812dba',
        'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf'
      ],
      tags: ['cooking', 'cuisine', 'culture', 'food'],
      pricing: {
        base: 75.00,
        ingredients: 25.00,
        private_class: 300.00
      },
      is_active: true,
      metadata: {
        max_participants: 10,
        includes_meal: true,
        chef: 'Marco Bianchi'
      }
    }
  ],

  // Sample accommodations
  accommodations: [
    {
      name: 'Mountain View Lodge',
      type: 'lodge',
      description: 'Cozy wooden lodge with stunning mountain views',
      location: 'Alpine Village, Switzerland',
      contact: 'lodge@example.com | +41-555-123-4567',
      images: [
        'https://images.unsplash.com/photo-1518732714860-b62714ce0c59',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
      ],
      pricing: {
        standard_room: 150.00,
        deluxe_room: 225.00,
        suite: 350.00
      },
      amenities: ['wifi', 'breakfast', 'fireplace', 'sauna', 'shuttle'],
      availability: {
        blackout_dates: ['2025-12-24', '2025-12-25', '2025-12-31'],
        advance_booking: '6 months'
      },
      is_active: true,
      meta_data: {
        built: 2010,
        renovated: 2022,
        rooms: 24
      }
    },
    {
      name: 'Beachside Villas',
      type: 'villa',
      description: 'Luxurious private villas right on the beach front',
      location: 'Coastal Bay, Bali',
      contact: 'reservations@beachvillas.example.com | +62-555-987-6543',
      images: [
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
      ],
      pricing: {
        one_bedroom: 275.00,
        two_bedroom: 425.00,
        family_villa: 575.00
      },
      amenities: ['private pool', 'kitchen', 'beach access', 'air conditioning', 'butler'],
      availability: {
        min_stay: 3,
        high_season: ['2025-06-01', '2025-08-31']
      },
      is_active: true,
      meta_data: {
        built: 2018,
        villas: 12,
        beach_front: true
      }
    }
  ]
};

/**
 * Seed database with sample data
 */
async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Check if organization already exists with the same slug
    console.log('Checking for existing organization...');
    const { data: existingOrg, error: checkOrgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('slug', sampleData.organization.slug)
      .single();
    
    let orgId;
    
    if (existingOrg) {
      console.log(`Organization with slug '${sampleData.organization.slug}' already exists, using existing ID: ${existingOrg.id}`);
      orgId = existingOrg.id;
      
      // Update the existing organization
      await supabase
        .from('organizations')
        .update({
          name: sampleData.organization.name,
          description: sampleData.organization.description,
          website: sampleData.organization.website,
          contact_email: sampleData.organization.contact_email,
          contact_phone: sampleData.organization.contact_phone,
          metadata: sampleData.organization.metadata
        })
        .eq('id', orgId);
      
      console.log(`Updated existing organization with ID: ${orgId}`);
    } else {
      // Insert new organization
      console.log('Creating new organization...');
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert(sampleData.organization)
        .select('id')
        .single();
      
      if (orgError) {
        console.error('Error creating organization:', orgError);
        throw orgError;
      }
      
      console.log(`Created organization with ID: ${orgData.id}`);
      orgId = orgData.id;
    }
    
    // Check if user profile already exists
    console.log('Checking for existing user profile...');
    const { data: existingUser, error: checkUserError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('email', sampleData.user.email)
      .single();
    
    let userId;
    
    if (existingUser) {
      console.log(`User with email '${sampleData.user.email}' already exists, using existing ID: ${existingUser.id}`);
      userId = existingUser.id;
      
      // Update the existing user
      await supabase
        .from('user_profiles')
        .update({
          full_name: sampleData.user.full_name,
          avatar_url: sampleData.user.avatar_url,
          onboarding_completed: sampleData.user.onboarding_completed,
          preferences: sampleData.user.preferences
        })
        .eq('id', userId);
        
      console.log(`Updated existing user profile with ID: ${userId}`);
    } else {
      // Insert new user profile
      console.log('Creating new user profile...');
      const generatedUserId = uuidv4();
      const { data: userData, error: userError } = await supabase
        .from('user_profiles')
        .insert({
          ...sampleData.user,
          id: generatedUserId
        })
        .select('id')
        .single();
      
      if (userError) {
        console.error('Error creating user profile:', userError);
        throw userError;
      }
      
      console.log(`Created user profile with ID: ${userData.id}`);
      userId = userData.id;
    }
    
    // Check if user is already linked to organization
    console.log('Checking user-organization link...');
    const { data: existingLink, error: checkLinkError } = await supabase
      .from('organization_users')
      .select('id')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .single();
      
    if (existingLink) {
      console.log(`User is already linked to organization with ID: ${existingLink.id}`);
    } else {
      // Link user to organization
      console.log('Linking user to organization...');
      const { error: linkError } = await supabase
        .from('organization_users')
        .insert({
          organization_id: orgId,
          user_id: userId,
          role: 'admin'
        });
        
      if (linkError) {
        console.error('Error linking user to organization:', linkError);
        throw linkError;
      }
      
      console.log('Linked user to organization as admin');
    }
    
    // Insert or update tours
    console.log('Creating tours...');
    const toursWithOrgId = sampleData.tours.map(tour => ({
      ...tour,
      org_id: orgId,
      duration: "5 days"  // Simplified for insertion
    }));
    
    // Track created tour IDs
    const tourIds = [];
    
    // Process each tour individually to handle conflicts
    for (const tour of toursWithOrgId) {
      // Check if a similar tour already exists
      const { data: existingTour, error: checkTourError } = await supabase
        .from('tours')
        .select('id, title')
        .eq('org_id', orgId)
        .eq('title', tour.title)
        .single();
      
      if (existingTour) {
        console.log(`Tour titled '${tour.title}' already exists, updating...`);
        const { error: updateTourError } = await supabase
          .from('tours')
          .update(tour)
          .eq('id', existingTour.id);
          
        if (updateTourError) {
          console.error(`Error updating tour '${tour.title}':`, updateTourError);
        } else {
          console.log(`Updated tour: ${tour.title} (${existingTour.id})`);
          tourIds.push(existingTour.id);
        }
      } else {
        // Insert new tour
        const { data: newTour, error: insertTourError } = await supabase
          .from('tours')
          .insert(tour)
          .select('id, title')
          .single();
          
        if (insertTourError) {
          console.error(`Error creating tour '${tour.title}':`, insertTourError);
        } else {
          console.log(`Created tour: ${newTour.title} (${newTour.id})`);
          tourIds.push(newTour.id);
        }
      }
    }
    
    console.log(`Processed ${tourIds.length} tours`);
    
    // Insert or update customers
    console.log('Creating customers...');
    const customersWithOrgId = sampleData.customers.map(customer => ({
      ...customer,
      org_id: orgId
    }));
    
    // Track created customer IDs
    const customerIds = [];
    
    // Process each customer individually to handle conflicts
    for (const customer of customersWithOrgId) {
      // Check if a similar customer already exists
      const { data: existingCustomer, error: checkCustomerError } = await supabase
        .from('customers')
        .select('id, email')
        .eq('org_id', orgId)
        .eq('email', customer.email)
        .single();
      
      if (existingCustomer) {
        console.log(`Customer with email '${customer.email}' already exists, updating...`);
        const { error: updateCustomerError } = await supabase
          .from('customers')
          .update(customer)
          .eq('id', existingCustomer.id);
          
        if (updateCustomerError) {
          console.error(`Error updating customer '${customer.email}':`, updateCustomerError);
        } else {
          console.log(`Updated customer: ${customer.name} (${existingCustomer.id})`);
          customerIds.push(existingCustomer.id);
        }
      } else {
        // Insert new customer
        const { data: newCustomer, error: insertCustomerError } = await supabase
          .from('customers')
          .insert(customer)
          .select('id, name')
          .single();
          
        if (insertCustomerError) {
          console.error(`Error creating customer '${customer.email}':`, insertCustomerError);
        } else {
          console.log(`Created customer: ${newCustomer.name} (${newCustomer.id})`);
          customerIds.push(newCustomer.id);
        }
      }
    }
    
    console.log(`Processed ${customerIds.length} customers`);
    
    // Insert or update experiences
    console.log('Creating experiences...');
    const experiencesWithOrgId = sampleData.experiences.map(exp => ({
      ...exp,
      org_id: orgId,
      duration: "4 hours"  // Simplified for insertion
    }));
    
    // Track created experience IDs
    const experienceIds = [];
    
    // Process each experience individually to handle conflicts
    for (const experience of experiencesWithOrgId) {
      // Check if a similar experience already exists
      const { data: existingExperience, error: checkExpError } = await supabase
        .from('experiences')
        .select('id, name')
        .eq('org_id', orgId)
        .eq('name', experience.name)
        .single();
      
      if (existingExperience) {
        console.log(`Experience named '${experience.name}' already exists, updating...`);
        const { error: updateExpError } = await supabase
          .from('experiences')
          .update(experience)
          .eq('id', existingExperience.id);
          
        if (updateExpError) {
          console.error(`Error updating experience '${experience.name}':`, updateExpError);
        } else {
          console.log(`Updated experience: ${experience.name} (${existingExperience.id})`);
          experienceIds.push(existingExperience.id);
        }
      } else {
        // Insert new experience
        const { data: newExperience, error: insertExpError } = await supabase
          .from('experiences')
          .insert(experience)
          .select('id, name')
          .single();
          
        if (insertExpError) {
          console.error(`Error creating experience '${experience.name}':`, insertExpError);
        } else {
          console.log(`Created experience: ${newExperience.name} (${newExperience.id})`);
          experienceIds.push(newExperience.id);
        }
      }
    }
    
    console.log(`Processed ${experienceIds.length} experiences`);
    
    // Insert or update accommodations
    console.log('Creating accommodations...');
    const accommodationsWithOrgId = sampleData.accommodations.map(acc => ({
      ...acc,
      org_id: orgId
    }));
    
    // Track created accommodation IDs
    const accommodationIds = [];
    
    // Process each accommodation individually to handle conflicts
    for (const accommodation of accommodationsWithOrgId) {
      // Check if a similar accommodation already exists
      const { data: existingAccommodation, error: checkAccError } = await supabase
        .from('accommodations')
        .select('id, name')
        .eq('org_id', orgId)
        .eq('name', accommodation.name)
        .single();
      
      if (existingAccommodation) {
        console.log(`Accommodation named '${accommodation.name}' already exists, updating...`);
        const { error: updateAccError } = await supabase
          .from('accommodations')
          .update(accommodation)
          .eq('id', existingAccommodation.id);
          
        if (updateAccError) {
          console.error(`Error updating accommodation '${accommodation.name}':`, updateAccError);
        } else {
          console.log(`Updated accommodation: ${accommodation.name} (${existingAccommodation.id})`);
          accommodationIds.push(existingAccommodation.id);
        }
      } else {
        // Insert new accommodation
        const { data: newAccommodation, error: insertAccError } = await supabase
          .from('accommodations')
          .insert(accommodation)
          .select('id, name')
          .single();
          
        if (insertAccError) {
          console.error(`Error creating accommodation '${accommodation.name}':`, insertAccError);
        } else {
          console.log(`Created accommodation: ${newAccommodation.name} (${newAccommodation.id})`);
          accommodationIds.push(newAccommodation.id);
        }
      }
    }
    
    console.log(`Processed ${accommodationIds.length} accommodations`);
    
    // Skip booking creation if we don't have tours or customers
    if (tourIds.length === 0 || customerIds.length === 0) {
      console.log('Skipping booking creation since we need tours and customers first');
    } else {
      // Create bookings
      console.log('Creating bookings...');
      
      // Use the first tour and customer if available
      const bookings = [
        {
          org_id: orgId,
          tour_id: tourIds[0] || null,
          customer_id: customerIds[0] || null,
          num_participants: 2,
          total_price: 2599.98,
          status: 'confirmed',
          payment_status: 'paid',
          confirmation_code: 'BK' + Math.floor(100000 + Math.random() * 900000),
          start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
          special_requests: 'Vegetarian meals required. Early check-in if possible.'
        }
      ];
      
      // Track booking IDs
      const bookingIds = [];
      
      // Process each booking individually
      for (const booking of bookings) {
        // Check if a similar booking already exists
        const { data: existingBooking, error: checkBookingError } = await supabase
          .from('bookings')
          .select('id, confirmation_code')
          .eq('org_id', orgId)
          .eq('confirmation_code', booking.confirmation_code)
          .single();
        
        if (existingBooking) {
          console.log(`Booking with confirmation code '${booking.confirmation_code}' already exists, updating...`);
          const { error: updateBookingError } = await supabase
            .from('bookings')
            .update(booking)
            .eq('id', existingBooking.id);
            
          if (updateBookingError) {
            console.error(`Error updating booking:`, updateBookingError);
          } else {
            console.log(`Updated booking with ID: ${existingBooking.id}`);
            bookingIds.push(existingBooking.id);
          }
        } else {
          // Insert new booking
          const { data: newBooking, error: insertBookingError } = await supabase
            .from('bookings')
            .insert(booking)
            .select('id, confirmation_code')
            .single();
            
          if (insertBookingError) {
            console.error(`Error creating booking:`, insertBookingError);
          } else {
            console.log(`Created booking with confirmation code: ${newBooking.confirmation_code} (${newBooking.id})`);
            bookingIds.push(newBooking.id);
          }
        }
      }
      
      console.log(`Processed ${bookingIds.length} bookings`);
      
      // Skip booking items and payments if no bookings were created
      if (bookingIds.length === 0) {
        console.log('Skipping booking items and payments since we need bookings first');
      } else {
        // Create some AI assistants
        console.log('Creating AI assistants...');
        const assistants = [
          {
            org_id: orgId,
            name: 'Booking Assistant',
            description: 'Helps customers with the booking process',
            model: 'gpt-4',
            system_prompt: 'You are a helpful tour booking assistant. Help customers find and book the perfect tour experience.',
            capabilities: ['booking', 'recommendations', 'answering_questions'],
            is_active: true,
            settings: {
              temperature: 0.7,
              max_tokens: 500
            }
          }
        ];
        
        // Process each assistant individually
        for (const assistant of assistants) {
          // Check if a similar assistant already exists
          const { data: existingAssistant, error: checkAssistantError } = await supabase
            .from('ai_assistants')
            .select('id, name')
            .eq('org_id', orgId)
            .eq('name', assistant.name)
            .single();
          
          if (existingAssistant) {
            console.log(`AI Assistant named '${assistant.name}' already exists, updating...`);
            const { error: updateAssistantError } = await supabase
              .from('ai_assistants')
              .update(assistant)
              .eq('id', existingAssistant.id);
              
            if (updateAssistantError) {
              console.error(`Error updating AI assistant:`, updateAssistantError);
            } else {
              console.log(`Updated AI assistant: ${assistant.name}`);
            }
          } else {
            // Insert new assistant
            const { data: newAssistant, error: insertAssistantError } = await supabase
              .from('ai_assistants')
              .insert(assistant)
              .select('id, name')
              .single();
              
            if (insertAssistantError) {
              console.error(`Error creating AI assistant:`, insertAssistantError);
            } else {
              console.log(`Created AI assistant: ${newAssistant.name}`);
            }
          }
        }
      }
    }
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
