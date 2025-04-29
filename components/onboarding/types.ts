export interface CompanyDetails {
  name: string;
  description: string;
  website: string;
  yearEstablished: string;
  employeeCount: string;
  specialties: string;
  targetMarket: string;
  locations: {
    headquarters: string;
    operatingRegions: string[];
  };
  businessModel: {
    type: 'b2c' | 'b2b' | 'both';
    averageBookingValue: string;
    annualBookings: string;
  };
}

export interface ServiceOfferings {
  tourTypes: string[];
  customPackages: boolean;
  groupSize: {
    min: number;
    max: number;
  };
  destinationsServed: string[];
  languages: string[];
  specialServices: string[];
}

export interface ClientExperience {
  bookingChannels: string[];
  communicationPreferences: string[];
  paymentMethods: string[];
  cancellationPolicy: string;
  customerSupport: {
    channels: string[];
    availability: '24/7' | 'business-hours' | 'custom';
  };
}

export interface AIPreferences {
  communicationStyle: 'professional' | 'casual';
  responseLength: 'concise' | 'balanced' | 'detailed';
  languagePreference: string;
  automationLevel: 'minimal' | 'balanced' | 'full';
  customizationLevel: 'minimal' | 'moderate' | 'high';
  proactiveEngagement: boolean;
}

export interface AssistantPreferences {
  discovery: boolean;
  itinerary: boolean;
  concierge: boolean;
  notifications: boolean;
  bookingAssistant: boolean;
  customerSupport: boolean;
  marketingAssistant: boolean;
}

export interface OnboardingFormData {
  companyDetails: CompanyDetails;
  serviceOfferings: ServiceOfferings;
  clientExperience: ClientExperience;
  aiPreferences: AIPreferences;
  assistantPreferences: AssistantPreferences;
}
