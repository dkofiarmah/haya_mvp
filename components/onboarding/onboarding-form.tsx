"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/providers/supabase-auth-provider"
import { StepHeader } from "./step-header"
import { OnboardingStepIndicator } from "./step-indicator"
import { motion, AnimatePresence } from "framer-motion"
import { useOnboarding } from "@/hooks/use-onboarding"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { CompanyProfileStep } from "./steps/company-profile-step"
import { ServiceOfferingsStep } from "./steps/service-offerings-step"
import { ClientExperienceStep } from "./steps/client-experience-step"
import { AIConfigurationStep } from "./steps/ai-configuration-step"
import { ReviewStep } from "./steps/review-step"
import { OnboardingFormData } from "./types"
import { Building2, Globe2, Users2, Bot, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabaseClient } from "@/lib/supabase/auth-client"
import { SkipOnboardingDialog } from "./skip-dialog"
import { submitOnboardingForm } from "./onboarding-form-submit"

const TOTAL_STEPS = 5

const STEPS = [
  { id: 1, title: "Company Profile", Icon: Building2, color: "bg-blue-500", description: "Tell us about your business" },
  { id: 2, title: "Service Offerings", Icon: Globe2, color: "bg-emerald-500", description: "Define your tour services" },
  { id: 3, title: "Client Experience", Icon: Users2, color: "bg-amber-500", description: "Customize customer interactions" },
  { id: 4, title: "AI Configuration", Icon: Bot, color: "bg-purple-500", description: "Set up your AI assistants" },
  { id: 5, title: "Review & Complete", Icon: CheckCircle2, color: "bg-primary", description: "Confirm your preferences" }
]

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
      const savedData = localStorage.getItem('haya_onboarding_data');
      const orgInfo = localStorage.getItem('newOrgInfo');
      
      if (savedData) {
        try {
          const { formData: savedFormData, lastStep } = JSON.parse(savedData);
          if (savedFormData) setFormData(savedFormData);
          if (lastStep) setStep(lastStep);
        } catch (error) {
          console.error("Failed to load saved onboarding data:", error);
        }
      } else if (orgInfo) {
        // Pre-populate with organization info if no saved progress
        try {
          const { name } = JSON.parse(orgInfo);
          setFormData(prev => ({
            ...prev,
            companyDetails: {
              ...prev.companyDetails,
              name
            }
          }));
        } catch (error) {
          console.error("Failed to load organization info:", error);
        }
      }
    };

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
            onboarding_completed: false // User skipped, don't mark as complete in DB
          })
          .eq('id', user.id);
      }
      
      // Set special flag to indicate onboarding was skipped (but not completed)
      localStorage.setItem('onboarding_skipped', 'true');
      // We don't want to set onboarding_completed to true in localStorage
      
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
      // Use the safe RPC function to avoid recursion issues
      const { data: userOrgs, error: userOrgsError } = await supabaseClient
        .rpc('get_user_organizations_safe', { user_uuid: user.id });

      if (userOrgsError) {
        console.error('Error fetching user organizations:', userOrgsError);
        
        // Fall back to a simpler query as a last resort
        const { data: orgUserData, error: orgUserError } = await supabaseClient
          .from('organization_users')
          .select('organization_id')
          .eq('user_id', user.id)
          .single();
        
        if (orgUserError || !orgUserData?.organization_id) {
          console.error('Error fetching organization:', orgUserError || 'No organization found');
          throw new Error("Organization not found");
        }
        
        // Get the organization directly
        const { data: orgData, error: orgError } = await supabaseClient
          .from('organizations')
          .select('id, name')
          .eq('id', orgUserData.organization_id)
          .single();
          
        if (orgError || !orgData) {
          console.error('Error fetching organization details:', orgError);
          throw new Error("Organization not found");
        }
      }
      
      // Get organization ID either from RPC function or fallback
      const organizationId = userOrgs && userOrgs.length > 0 
        ? userOrgs[0].id 
        : orgUserData?.organization_id;
        
        // Update organization details
        const { error: updateError } = await supabaseClient
        .from("organizations")
        .update({
          name: formData.companyDetails.name,
          description: formData.companyDetails.description,
          website: formData.companyDetails.website,
          settings: {
            // Store metadata in settings since there's no metadata column
            yearEstablished: formData.companyDetails.yearEstablished,
            employeeCount: formData.companyDetails.employeeCount,
            specialties: formData.serviceOfferings.specialServices,
            locations: formData.companyDetails.locations,
            businessModel: formData.companyDetails.businessModel,
            allow_name_edit: false, // Disable name editing after onboarding
            // Other settings
            tour_types: formData.serviceOfferings.tourTypes,
            languages: formData.serviceOfferings.languages,
            booking_channels: formData.clientExperience.bookingChannels,
            payment_methods: formData.clientExperience.paymentMethods,
            communication_preferences: formData.clientExperience.communicationPreferences,
            ai_settings: {
              communicationStyle: formData.aiPreferences.communicationStyle,
              responseLength: formData.aiPreferences.responseLength,
              languagePreference: formData.aiPreferences.languagePreference,
              automationLevel: formData.aiPreferences.automationLevel,
              customizationLevel: formData.aiPreferences.customizationLevel,
              proactiveEngagement: formData.aiPreferences.proactiveEngagement
            },
            enabled_assistants: Object.entries(formData.assistantPreferences)
              .filter(([_, enabled]) => enabled)
              .map(([key]) => key),
            support_settings: {
              channels: formData.clientExperience.customerSupport.channels,
              availability: formData.clientExperience.customerSupport.availability
            }
          }
        })
        .eq("id", organizationId);

      if (updateError) {
        console.error('Error updating organization:', updateError);
        throw updateError;
      }

      // Clear saved onboarding data
      localStorage.removeItem('haya_onboarding_data');
      localStorage.removeItem('newOrgInfo');
      localStorage.setItem('onboarding_seen', 'true');
      
      // Mark onboarding as complete
      await markComplete();
      
      toast({
        title: "Welcome to Haya!",
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

  const currentStep = STEPS[step - 1];

  return (
    <div className="space-y-8">
      {/* Skip Dialog */}
      <SkipOnboardingDialog
        open={showSkipDialog}
        onOpenChange={setShowSkipDialog}
        onConfirm={handleSkipOnboarding}
        isSkipping={isSkipping}
      />
      
      {/* Onboarding Header */}
      <div className="space-y-6 text-center max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-2">
          <div className={`${currentStep.color} w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg`}>
            <currentStep.Icon className="h-8 w-8" />
          </div>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{currentStep.title}</h1>
          <p className="text-muted-foreground mt-2">{currentStep.description}</p>
        </div>
        
        <div className="relative pt-4">
          <OnboardingStepIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Step content */}
      <div className="pb-10">
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
              <CompanyProfileStep 
                data={formData.companyDetails} 
                onUpdateAction={(data) => setFormData({ ...formData, companyDetails: data })}
                onNextAction={() => setStep(2)} 
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

          {step === 2 && (
            <motion.div
              key="service-offerings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <ServiceOfferingsStep 
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
              key="client-experience"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <ClientExperienceStep 
                data={formData.clientExperience}
                onUpdateAction={(data) => setFormData({ ...formData, clientExperience: data })}
                onNextAction={() => setStep(4)}
                onBackAction={() => setStep(2)}
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

          {step === 4 && (
            <motion.div
              key="ai-configuration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <AIConfigurationStep 
                data={formData.aiPreferences}
                assistantData={formData.assistantPreferences}
                onUpdateAction={(ai, assistant) => setFormData({ 
                  ...formData, 
                  aiPreferences: ai,
                  assistantPreferences: assistant 
                })}
                onNextAction={() => setStep(5)}
                onBackAction={() => setStep(3)}
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

          {step === 5 && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <ReviewStep 
                data={formData}
                isLoading={isLoading}
                onSubmitAction={handleSubmit}
                onBackAction={() => setStep(4)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
