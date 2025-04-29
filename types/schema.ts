/**
 * Types schema for Haya MVP
 * Defines TypeScript interfaces for the application data models
 */

export interface OrganizationSchema {
  id: string;
  name: string;
  slug: string;
  description?: string;
  website?: string;
  contact_email: string;
  contact_phone?: string;
  subscription_status: string;
  subscription_tier: string;
  trial_ends_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface UserSchema {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  org_id: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface ExperienceSchema {
  id: string;
  org_id: string;
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  max_group_size: number;
  min_group_size: number;
  price_per_person: number;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  included?: string[];
  not_included?: string[];
  requirements?: string[];
  images?: string[];
  highlights?: string[];
  cancellation_policy: string;
  meeting_point?: string;
  languages?: string[];
  tags?: string[];
  is_active: boolean;
  meta_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
  
  // Enhanced fields
  is_archived?: boolean;
  archived_at?: string;
  archived_by?: string;
  created_by?: string;
  updated_by?: string;
  shareable_token?: string;
  slug?: string;
  is_bookable_online?: boolean;
  is_shareable?: boolean;
  booking_notice_hours?: number;
  available_dates?: any[];
  organizations?: { name: string };
  view_count?: number;
  booking_count?: number;
  avg_rating?: number;
  total_reviews?: number;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  ai_description?: string;
  ai_enhanced?: boolean;
  public_notes?: string;
  internal_notes?: string;
  published_at?: string;
  status?: 'draft' | 'published' | 'archived';
  embeddings_vector?: any;
  seasonal_availability?: {
    start_date: string;
    end_date: string;
    reason?: string;
  }[];
}

export interface ExperienceBookingSchema {
  id: string;
  experience_id: string;
  org_id: string;
  customer_id?: string;
  booking_date: string;
  party_size: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'unpaid' | 'paid' | 'refunded' | 'partial';
  payment_link?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ExperienceAuditLogSchema {
  id: string;
  experience_id: string;
  user_id: string;
  action_type: 'create' | 'update' | 'archive' | 'restore';
  changes: Record<string, any>;
  created_at: string;
  user?: {
    email: string;
    full_name?: string;
  };
}

export interface TourSchema {
  id: string;
  org_id: string;
  title: string;
  itinerary_json: Record<string, any>;
  status: string;
  pricing: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerSchema {
  id: string;
  org_id: string;
  name: string;
  email: string;
  phone?: string;
  preferences?: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface BookingSchema {
  id: string;
  org_id: string;
  tour_id: string;
  customer_id: string;
  num_participants: number;
  total_price: number;
  status: string;
  special_requests?: string;
  payment_status: string;
  payment_id?: string;
  meta_data?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface PaymentSchema {
  id: string;
  customer_id: string;
  org_id: string;
  tour_id?: string;
  amount: number;
  status: string;
  method?: string;
  invoice_url?: string;
  stripe_charge_id?: string;
  created_at: string;
  updated_at: string;
}

export interface AgentSchema {
  id: string;
  org_id: string;
  name: string;
  type: string;
  state?: Record<string, any>;
  memory_json?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AgentLogSchema {
  id: string;
  agent_id: string;
  event: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface ModelsConfigSchema {
  id: string;
  org_id: string;
  agent_type: string;
  preferred_llm: string;
  config_details?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
