'use client'

import { AlertCircle, Check, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import Link from 'next/link'

interface ExperienceValidationProps {
  experience: any;
}

export default function ExperienceValidation({ experience }: ExperienceValidationProps) {
  // Define validation rules for a complete experience
  const validationRules = [
    {
      id: 'has-name',
      label: 'Experience has a name',
      isValid: !!experience.name && experience.name.length > 0,
      fixUrl: `/experiences/${experience.id}/edit`,
      fixText: 'Add a name'
    },
    {
      id: 'has-description',
      label: 'Experience has a description',
      isValid: !!experience.description && experience.description.length > 20,
      fixUrl: `/experiences/${experience.id}/edit`,
      fixText: 'Improve description'
    },
    {
      id: 'has-images',
      label: 'Experience has at least one image',
      isValid: !!experience.images && experience.images.length > 0,
      fixUrl: `/experiences/${experience.id}/edit?tab=media`,
      fixText: 'Add images'
    },
    {
      id: 'has-location',
      label: 'Location is specified',
      isValid: !!experience.location && experience.location.length > 0,
      fixUrl: `/experiences/${experience.id}/edit`,
      fixText: 'Add location'
    },
    {
      id: 'has-pricing',
      label: 'Price is set',
      isValid: experience.price_per_person > 0,
      fixUrl: `/experiences/${experience.id}/edit?tab=booking`,
      fixText: 'Set price'
    },
    {
      id: 'has-duration',
      label: 'Duration is specified',
      isValid: experience.duration_minutes > 0,
      fixUrl: `/experiences/${experience.id}/edit`,
      fixText: 'Add duration'
    },
    {
      id: 'has-highlights',
      label: 'Highlights are added',
      isValid: !!experience.highlights && experience.highlights.length > 0,
      fixUrl: `/experiences/${experience.id}/edit?tab=details`,
      fixText: 'Add highlights'
    },
    {
      id: 'has-cancellation',
      label: 'Cancellation policy is specified',
      isValid: !!experience.cancellation_policy && experience.cancellation_policy.length > 0,
      fixUrl: `/experiences/${experience.id}/edit?tab=booking`,
      fixText: 'Add policy'
    },
    {
      id: 'online-booking',
      label: 'Online booking is enabled',
      isValid: !!experience.is_bookable_online,
      fixUrl: `/experiences/${experience.id}/edit?tab=booking`,
      fixText: 'Enable booking'
    },
    {
      id: 'is-active',
      label: 'Experience is active',
      isValid: !!experience.is_active,
      fixUrl: `/experiences/${experience.id}/edit`,
      fixText: 'Activate'
    }
  ]
  
  // Count valid and invalid rules
  const validCount = validationRules.filter(rule => rule.isValid).length
  const totalCount = validationRules.length
  const percentComplete = Math.round((validCount / totalCount) * 100)
  
  // Determine overall status
  const isComplete = validCount === totalCount
  const isAlmostComplete = percentComplete >= 70 && percentComplete < 100
  
  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
      <h3 className="text-lg font-medium">Experience Validation</h3>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            isComplete 
              ? 'bg-green-600' 
              : isAlmostComplete 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
          }`}
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
      
      <p className="text-sm text-gray-500">
        {isComplete 
          ? '✅ Your experience is complete and ready for booking!' 
          : `${validCount} of ${totalCount} requirements complete (${percentComplete}%)`
        }
      </p>
      
      {/* Status alert */}
      {!isComplete && (
        <Alert variant={isAlmostComplete ? "warning" : "destructive"}>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {isAlmostComplete 
              ? 'Almost there!' 
              : 'Experience Incomplete'
            }
          </AlertTitle>
          <AlertDescription>
            {isAlmostComplete
              ? 'Your experience is almost ready. Complete the remaining items to activate it.'
              : 'Your experience needs more information before it can be published.'
            }
          </AlertDescription>
        </Alert>
      )}
      
      {/* Validation checklist */}
      <div className="space-y-2 pt-2">
        {validationRules.map((rule) => (
          <div key={rule.id} className="flex items-center justify-between py-1 border-b last:border-0">
            <div className="flex items-center">
              {rule.isValid ? (
                <Check className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={rule.isValid ? 'text-gray-600' : 'text-gray-900 font-medium'}>
                {rule.label}
              </span>
            </div>
            
            {!rule.isValid && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={rule.fixUrl}>
                  {rule.fixText}
                  <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        ))}
      </div>
      
      {isComplete && (
        <div className="pt-2">
          <Link 
            href={`/experiences/share-redirect/${experience.id}`}
            target="_blank"
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
          >
            Preview public view <ExternalLink className="ml-1 h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
