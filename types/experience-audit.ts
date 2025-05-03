// Types for the Experience Audit Log functionality
export interface ExperienceAuditRecord {
  id?: string; // UUID, auto-generated
  experience_id: string; // UUID of the related experience
  organization_id: string; // UUID of the organization
  user_id: string; // UUID of the user who performed the action
  action_type: 'created' | 'updated' | 'deleted' | 'archived' | 'unarchived' | 'viewed' | 'shared' | 'booked';
  changes: Record<string, any> | null;
  created_at?: string; // Timestamp, auto-generated
}
