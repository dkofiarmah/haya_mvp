'use client'

import { supabaseClient } from "@/lib/supabase/auth-client";
import { OnboardingFormData } from "./types";
import { User } from "@supabase/supabase-js";

export async function submitOnboardingForm(user: User, formData: OnboardingFormData) {
  // Get organization ID through the organization_users join table
  const { data: orgData, error: orgError } = await supabaseClient
    .from("organization_users")
    .select("organization_id")
    .eq("user_id", user.id)
    .single();

  if (orgError || !orgData?.organization_id) {
    throw new Error("Organization not found");
  }

  // Update organization details
  await supabaseClient
    .from("organizations")
    .update({
      name: formData.companyDetails.name || 'My Tour Company',
      description: formData.companyDetails.description,
      website: formData.companyDetails.website,
      metadata: {
        yearEstablished: formData.companyDetails.yearEstablished,
        employeeCount: formData.companyDetails.employeeCount,
        specialties: formData.serviceOfferings.specialServices,
        locations: formData.companyDetails.locations,
        businessModel: formData.companyDetails.businessModel
      }
    })
    .eq("id", orgData.organization_id);

  // Update organization preferences
  await supabaseClient
    .from("organization_preferences")
    .upsert({
      org_id: orgData.organization_id,
      tour_types: formData.serviceOfferings.tourTypes,
      languages: formData.serviceOfferings.languages,
      booking_channels: formData.clientExperience.bookingChannels,
      payment_methods: formData.clientExperience.paymentMethods,
      communication_preferences: formData.clientExperience.communicationPreferences,
      ai_settings: {
        communicationStyle: formData.aiPreferences.communicationStyle,
        responseLength: formData.aiPreferences.responseLength,
        automationLevel: formData.aiPreferences.automationLevel,
        customizationLevel: formData.aiPreferences.customizationLevel
      },
      enabled_assistants: Object.entries(formData.assistantPreferences)
        .filter(([_, enabled]) => enabled)
        .map(([key]) => key),
      support_settings: formData.clientExperience.customerSupport
    });
}
