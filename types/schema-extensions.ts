// Enhanced Experience Schema Types
import { Database } from '@/types/supabase';

// Define the enhanced Experience schema
export type ExperienceSchema = Database['public']['Tables']['experiences']['Row'] & {
  organizations?: {
    id: string;
    name: string;
    slug: string;
  };
};

// Define the Experience Booking schema
export type ExperienceBookingSchema = Database['public']['Tables']['experience_bookings']['Row'];

// Define the Experience Audit Log schema
export type ExperienceAuditLogSchema = Database['public']['Tables']['experience_audit_logs']['Row'] & {
  users?: {
    id: string;
    email: string;
  };
};

// Define the Experience Review schema
export type ExperienceReviewSchema = Database['public']['Tables']['experience_reviews']['Row'];
