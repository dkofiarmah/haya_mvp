"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { 
  Building2, 
  Globe2, 
  Users2, 
  Bot, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase/auth-client"
import { OnboardingStepIndicator } from "@/components/onboarding-step-indicator"
// Import the server action to fetch organizations
import { getUserOrganizations } from "@/app/actions/organizations"

// Step components (to be created in separate files)
import { SimplifiedCompanyStep } from "./steps/simplified-company-step"
import { SimplifiedServiceOfferingsStep } from "./steps/simplified-service-step"
import { SimplifiedAIStep } from "./steps/simplified-ai-step"
import { SkipOnboardingDialog } from "./skip-dialog"

const TOTAL_STEPS = 3

interface OnboardingFormData {
  companyDetails: {
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
      type: "b2c" | "b2b" | "both";
      averageBookingValue: string;
      annualBookings: string;
    };
  };
  serviceOfferings: {
    tourTypes: string[];
    customPackages: boolean;
    groupSize: {
      min: number;
      max: number;
    };
    destinationsServed: string[];
    languages: string[];
    specialServices: string[];
  };
  clientExperience: {
    bookingChannels: string[];
    communicationPreferences: string[];
    paymentMethods: string[];
    cancellationPolicy: string;
    customerSupport: {
      channels: string[];
      availability: string;
    };
  };
  aiPreferences: {
    communicationStyle: "casual" | "professional" | "friendly";
    responseLength: "concise" | "balanced" | "detailed";
    languagePreference: string;
    automationLevel: "minimal" | "balanced" | "extensive";
    customizationLevel: "low" | "moderate" | "high";
    proactiveEngagement: boolean;
  };
  assistantPreferences: {
    discovery: boolean;
    itinerary: boolean;
    concierge: boolean;
    notifications: boolean;
    bookingAssistant: boolean;
    customerSupport: boolean;
    marketingAssistant: boolean;
  };
}

// Streamlined steps for simpler onboarding
const STEPS = [
  { id: 1, title: "Business Profile", Icon: Building2, color: "bg-blue-500", description: "Confirm your company details" },
  { id: 2, title: "Tour Services", Icon: Globe2, color: "bg-emerald-500", description: "Tell us about your services" },
  { id: 3, title: "AI Preferences", Icon: Bot, color: "bg-purple-500", description: "Customize your AI experience" }
]

// Helper function to fetch user's organization
const fetchUserOrganization = async (userId: string) => {
  try {
    console.log("Fetching organization for user:", userId);
    
    // Use direct query to get organization users
    const { data: orgUserData, error: orgUserError } = await supabaseClient
      .from('organization_users')
      .select('organization_id')
      .eq('user_id', userId);
      
    if (orgUserError) {
      console.error("Error fetching organization_users:", orgUserError);
      return null;
    }
    
    if (!orgUserData || orgUserData.length === 0) {
      console.log("No organization found for user");
      return null;
    }
    
    console.log("Found organization_user entries:", orgUserData);
    
    // Get the organization details - explicitly select fields to ensure we get what we need
    const orgIds = orgUserData.map(ou => ou.organization_id);
    
    // Debug to help trace the issue
    console.log("Fetching organizations with IDs:", orgIds);
    
    // Default fetch using client credentials
    const { data: orgData, error: orgError } = await supabaseClient
      .from('organizations')
      .select('id, name, settings, created_at, updated_at')
      .in('id', orgIds);

    // Check if orgError has any keys - if it's an empty object, provide more info
    const hasRealError = orgError && Object.keys(orgError).length > 0;
    
    if (hasRealError) {
      console.error("Error fetching organizations:", JSON.stringify(orgError));
      return null;
    }
    
    if (!orgData || orgData.length === 0) {
      console.log("Organizations found but no data returned");
      return null;
    }
    
    console.log("Successfully fetched organization data:", orgData);
    return orgData;
    
  } catch (error) {
    console.error("Error fetching organization data:", error);
    return null;
  }
}

export function OnboardingForm() {
  const { user } = useAuth()
  const { markComplete, skipOnboarding } = useOnboarding()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [isSkipping, setIsSkipping] = useState(false)
  const [showSkipDialog, setShowSkipDialog] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const defaultFormData: OnboardingFormData = {
    companyDetails: {
      name: "",
      description: "",
      website: "",
      yearEstablished: "",
      employeeCount: "",
      specialties: "",
      targetMarket: "",
      locations: {
        headquarters: "",
        operatingRegions: [],
      },
      businessModel: {
        type: "b2c",
        averageBookingValue: "",
        annualBookings: "",
      }
    },
    serviceOfferings: {
      tourTypes: [],
      customPackages: true,
      groupSize: {
        min: 1,
        max: 20
      },
      destinationsServed: [],
      languages: [],
      specialServices: []
    },
    clientExperience: {
      bookingChannels: [],
      communicationPreferences: [],
      paymentMethods: [],
      cancellationPolicy: "",
      customerSupport: {
        channels: [],
        availability: "24/7"
      }
    },
    aiPreferences: {
      communicationStyle: "professional",
      responseLength: "balanced",
      languagePreference: "en",
      automationLevel: "balanced",
      customizationLevel: "moderate",
      proactiveEngagement: true
    },
    assistantPreferences: {
      discovery: true,
      itinerary: true,
      concierge: true,
      notifications: true,
      bookingAssistant: true,
      customerSupport: true,
      marketingAssistant: false
    }
  };

  const [formData, setFormData] = useState<OnboardingFormData>(defaultFormData);

  // Load saved progress and organization info
  useEffect(() => {
    const loadData = async () => {
      console.log("Loading onboarding data, user:", user);
      const savedData = localStorage.getItem('haya_onboarding_data');
      
      // Fetch organization data directly if user is available
      let userOrgs = null;
      if (user?.id) {
        console.log("Attempting to fetch user organization for:", user.id);
        userOrgs = await fetchUserOrganization(user.id);
        console.log("User organizations fetched:", userOrgs);
      }
      
      if (savedData) {
        try {
          const { formData: savedFormData, lastStep } = JSON.parse(savedData);
          if (savedFormData) setFormData(savedFormData);
          if (lastStep) setStep(lastStep);
        } catch (error) {
          console.error("Failed to load saved onboarding data:", error);
        }
      }
      
      // If we have organization info, use it to pre-populate the form
      if (userOrgs && Array.isArray(userOrgs) && userOrgs.length > 0) {
        const org = userOrgs[0];
        console.log("Organization data for pre-population:", org);
        
        // Check if org is valid
        if (!org) {
          console.error("Organization data is null or undefined");
          return;
        }
        
        let settings: Record<string, any> = {};
        
        // Safely parse settings if it's a string (sometimes JSON is stored as a string)
        if (org.settings) {
          if (typeof org.settings === 'string') {
            try {
              settings = JSON.parse(org.settings);
            } catch (e) {
              console.error('Failed to parse settings JSON string:', e);
            }
          } else if (typeof org.settings === 'object') {
            settings = org.settings as Record<string, any>;
          }
        }
        
        // Log the company name we're trying to use
        console.log("Company name from organization:", org.name);
        
        // Force company name to a string if it's null/undefined
        const companyName = org.name || "";
        console.log("Normalized company name:", companyName);
        
        // Safely extract values from settings with defaults
        setFormData(prev => ({
          ...prev,
          companyDetails: {
            ...prev.companyDetails,
            name: companyName, // Use our normalized name variable
            // We don't have a description column in the database
            description: settings?.description || "",
            website: settings?.website || "",
            yearEstablished: settings?.yearEstablished || "",
            employeeCount: settings?.employeeCount || "",
            specialties: settings?.specialties || "",
            locations: {
              headquarters: settings?.companyDetails?.locations?.headquarters || settings?.locations?.headquarters || "",
              operatingRegions: Array.isArray(settings?.companyDetails?.locations?.operatingRegions) 
                ? settings.companyDetails.locations.operatingRegions 
                : Array.isArray(settings?.locations?.operatingRegions) ? settings.locations.operatingRegions : []
            },
            businessModel: {
              type: (settings?.businessModel?.type as "b2c" | "b2b" | "both") || "b2c",
              averageBookingValue: settings?.businessModel?.averageBookingValue || "",
              annualBookings: settings?.businessModel?.annualBookings || ""
            }
          }
        }));
      }
    }

    loadData();
  }, []);

  // Calculate and set progress percentage
  useEffect(() => {
    const progressPercentage = ((step - 1) / (TOTAL_STEPS - 1)) * 100;
    setProgress(progressPercentage);
  }, [step]);

  // Save progress as user moves through steps
  useEffect(() => {
    if (step > 1) {
      localStorage.setItem('haya_onboarding_data', JSON.stringify({
        formData,
        lastStep: step
      }));
    }
  }, [step, formData]);

  const handleSkipOnboarding = async () => {
    setIsSkipping(true);
    try {
      // Save current progress to localStorage
      localStorage.setItem('haya_onboarding_data', JSON.stringify({
        formData,
        lastStep: step
      }));
      
      // Mark onboarding as seen in localStorage
      localStorage.setItem('onboarding_seen', 'true');
      
      // Mark onboarding as started but NOT completed in user_profiles table
      if (user) {
        await supabaseClient
          .from('user_profiles')
          .update({ 
            onboarding_step: step,
            onboarding_started: true,
            onboarding_completed: false, // User skipped, don't mark as complete in DB
            onboarding_skipped: true
          })
          .eq('id', user.id);
      }
      
      // Set special flag to indicate onboarding was skipped (but not completed)
      localStorage.setItem('onboarding_skipped', 'true');
      
      // Use the skipOnboarding function from the useOnboarding hook
      skipOnboarding();
      
      toast({
        title: "Setup skipped",
        description: "You can complete your setup anytime from your dashboard.",
      });
      
      router.push("/dashboard");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      toast({
        variant: "destructive",
        title: "Error saving progress",
        description: "We couldn't save your progress. Please try again.",
      });
    } finally {
      setIsSkipping(false);
      setShowSkipDialog(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Get the user's organization
      let organizationId = null;
      
      // Try different methods to get the organization ID
      try {
        // Method 1: Use our custom API endpoint instead of the missing RPC function
        const response = await fetch('/api/organizations/user-organizations');
        if (response.ok) {
          const userOrgs = await response.json();
          if (userOrgs && Array.isArray(userOrgs) && userOrgs.length > 0) {
            organizationId = userOrgs[0].organization_id;
          }
        }
      } catch (apiError) {
        console.error('API error:', apiError);
      }
      
      // If the RPC method failed, try the direct query
      if (!organizationId) {
        const { data: orgUserData, error: orgUserError } = await supabaseClient
          .from('organization_users')
          .select('organization_id')
          .eq('user_id', user.id)
          .single();
          
        if (!orgUserError && orgUserData?.organization_id) {
          organizationId = orgUserData.organization_id;
        }
      }
      
      // If we still don't have an organization ID, throw an error
      if (!organizationId) {
        throw new Error("Organization not found");
      }
      
      // Get current organization data to avoid overwriting existing data
      // We need to get name and settings
      const { data: currentOrgData, error: getOrgError } = await supabaseClient
        .from("organizations")
        .select("name, settings")
        .eq("id", organizationId)
        .single();
        
      if (getOrgError) {
        console.error('Error fetching organization data:', getOrgError);
        throw new Error("Failed to fetch organization data");
      }
      
      // Ensure settings is an object, not null or undefined
      const currentSettings = (typeof currentOrgData?.settings === 'object' && currentOrgData?.settings !== null) ? currentOrgData.settings : {};
      
      // Log the data we're about to update
      console.log("Updating organization with ID:", organizationId);
      console.log("Company name to update:", formData.companyDetails.name);
      
      // Update organization with simplified data
      const { error: updateError } = await supabaseClient
        .from("organizations")
        .update({
          // Always update name if provided
          name: formData.companyDetails.name || currentOrgData?.name || "",
          // Optional description field
          ...(formData.companyDetails.description && { description: formData.companyDetails.description }),
          // Merge settings with existing settings
          settings: {
            ...currentSettings,
            // Basic company information
            employeeCount: formData.companyDetails.employeeCount,
            locations: {
              headquarters: formData.companyDetails.locations.headquarters,
              operatingRegions: formData.companyDetails.locations.operatingRegions || []
            },
            // Tour services
            tour_types: formData.serviceOfferings.tourTypes || [],
            languages: formData.serviceOfferings.languages || [],
            customPackages: formData.serviceOfferings.customPackages,
            // AI settings
            ai_settings: {
              communicationStyle: formData.aiPreferences.communicationStyle,
              responseLength: formData.aiPreferences.responseLength,
              languagePreference: formData.aiPreferences.languagePreference,
              automationLevel: formData.aiPreferences.automationLevel,
              customizationLevel: formData.aiPreferences.customizationLevel,
              proactiveEngagement: formData.aiPreferences.proactiveEngagement
            },
            // Enabled assistants
            enabled_assistants: Object.entries(formData.assistantPreferences)
              .filter(([_, enabled]) => enabled)
              .map(([key]) => key),
            // Mark as completed onboarding
            onboarding_completed: true
          }
        })
        .eq("id", organizationId);

      if (updateError) {
        console.error('Error updating organization:', updateError);
        throw updateError;
      }

      // Clear saved onboarding data
      localStorage.removeItem('haya_onboarding_data');
      localStorage.removeItem('registrationData');
      localStorage.setItem('onboarding_seen', 'true');
      
      // Mark onboarding as complete
      await markComplete();
      
      toast({
        title: "Welcome to HAYA!",
        description: "Your workspace is now set up with your preferences.",
      });
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: error.message || "Failed to complete setup. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mb-10 min-h-[600px]">
      <SkipOnboardingDialog
        open={showSkipDialog}
        onOpenChange={setShowSkipDialog}
        onConfirm={handleSkipOnboarding}
        isLoading={isSkipping}
      />

      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Complete Your HAYA Profile</h1>
        <p className="text-muted-foreground">
          Verify your company details and answer a few quick questions to personalize your Haya experience
        </p>
      </div>

      <div className="mb-10">
        <OnboardingStepIndicator 
          steps={STEPS} 
          currentStep={step}
          progress={progress}
          onStepClickAction={(stepNum) => {
            // Only allow going back to previous steps
            if (stepNum < step) {
              setStep(stepNum);
            }
          }}
        />
        
        {step === 1 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-md text-blue-800 text-sm">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Please verify your company name and details below. These will be used throughout your Haya experience.
            </p>
          </div>
        )}
      </div>

      <div className="md:min-h-[460px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="company-profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Force organization name to be set correctly before showing the form */}
              {(() => {
                // Extra safety check to ensure company name is never empty
                if (!formData.companyDetails.name && user) {
                  console.log("Company name is empty, attempting to retrieve from user data");
                  
                  // Try to get from localStorage first (from registration)
                  const newUserInfo = localStorage.getItem('newUserInfo');
                  if (newUserInfo) {
                    try {
                      const parsedInfo = JSON.parse(newUserInfo);
                      if (parsedInfo.companyName) {
                        console.log("Found company name in localStorage:", parsedInfo.companyName);
                        formData.companyDetails.name = parsedInfo.companyName;
                      }
                    } catch (e) {
                      console.error("Error parsing newUserInfo:", e);
                    }
                  }
                }
                
                return (
                  <SimplifiedCompanyStep 
                    data={formData.companyDetails}
                    onUpdateAction={(data) => {
                      console.log("Company details updated:", data);
                      setFormData({ ...formData, companyDetails: data });
                    }}
                    onNextAction={() => setStep(2)} 
                    showOrgNameUpdate={true} // Enable organization name updating
                  />
                );
              })()}
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSkipDialog(true)}
                  disabled={isSkipping || isLoading}
                >
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="service-offerings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <SimplifiedServiceOfferingsStep 
                data={formData.serviceOfferings}
                onUpdateAction={(data) => setFormData({ ...formData, serviceOfferings: data })}
                onNextAction={() => setStep(3)}
                onBackAction={() => setStep(1)}
              />
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSkipDialog(true)}
                  disabled={isSkipping || isLoading}
                >
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="ai-configuration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <SimplifiedAIStep 
                data={{
                  aiPreferences: formData.aiPreferences,
                  assistantPreferences: formData.assistantPreferences
                }}
                onUpdateAction={(data) => setFormData({ 
                  ...formData, 
                  aiPreferences: data.aiPreferences,
                  assistantPreferences: data.assistantPreferences
                })}
                onNextAction={handleSubmit} // Submit directly from this step
                onBackAction={() => setStep(2)}
                isSubmitting={isLoading}
              />
              
              <div className="mt-6 flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSkipDialog(true)}
                  disabled={isSkipping || isLoading}
                >
                  Skip for now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
