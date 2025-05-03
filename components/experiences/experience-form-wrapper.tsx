'use client'

import { useState, useCallback } from 'react'
import { createExperience } from '@/app/actions/create-experience-fixed'
import { updateExperience } from '@/app/actions/experiences'
import { useRouter } from 'next/navigation'
import { Tab } from '@headlessui/react'
import { PlusCircle, Trash2, Calendar, Info, PencilLine, Map, CheckSquare, XCircle, Clock, Users, Tag, Globe, DollarSign, ImagePlus, Camera, List, CreditCard } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import clsx from 'clsx'

// Define the structure for experience data
interface ExperienceFormData {
  id?: string;
  name: string;
  description: string;
  category: string;
  duration_minutes: number;
  max_group_size: number;
  min_group_size: number;
  price_per_person: number;
  currency: string;
  location: string;
  meeting_point: string;
  coordinates?: { lat: number; lng: number } | null;
  included: string[];
  not_included: string[];
  requirements: string[];
  highlights: string[];
  cancellation_policy: string;
  languages: string[];
  tags: string[];
  images: (File | string)[];
  is_active: boolean;
  is_bookable_online: boolean;
  is_shareable: boolean;
  booking_notice_hours: number;
  available_dates: string[];
}

// Component props
interface ExperienceFormWrapperProps {
  mode: 'create' | 'edit';
  experienceId?: string;
  initialData?: Partial<ExperienceFormData>;
}

// Categories for experiences
const EXPERIENCE_CATEGORIES = [
  'Adventure', 'Cultural', 'Culinary', 'Nature', 'Wildlife',
  'City Tour', 'Historical', 'Wellness', 'Educational',
  'Photography', 'Luxury', 'Nightlife', 'Family-friendly',
  'Romantic', 'Religious', 'Festival', 'Sport', 'Beach'
];

// Currency options
const CURRENCY_OPTIONS = [
  { code: 'USD', label: 'US Dollar (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'GBP', label: 'British Pound (GBP)' },
  { code: 'KES', label: 'Kenyan Shilling (KES)' },
  { code: 'TZS', label: 'Tanzanian Shilling (TZS)' },
  { code: 'UGX', label: 'Ugandan Shilling (UGX)' },
  { code: 'RWF', label: 'Rwandan Franc (RWF)' },
  { code: 'ZAR', label: 'South African Rand (ZAR)' }
];

// Language options
const LANGUAGE_OPTIONS = [
  'English', 'French', 'Spanish', 'German', 'Italian', 
  'Portuguese', 'Swahili', 'Arabic', 'Chinese', 'Japanese',
  'Russian', 'Dutch', 'Korean', 'Hindi'
];

// Cancellation policy options
const CANCELLATION_POLICIES = [
  { value: 'Flexible', description: 'Full refund up to 24 hours before the start' },
  { value: 'Moderate', description: 'Full refund up to 5 days before the start' },
  { value: 'Strict', description: 'Full refund up to 7 days before the start' },
  { value: 'Non-refundable', description: 'No refunds once booked' }
];

export default function ExperienceFormWrapper({ 
  mode = 'create',
  experienceId,
  initialData = {}
}: ExperienceFormWrapperProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [currentTab, setCurrentTab] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  // Initialize form data with default values or provided initial data
  const [formData, setFormData] = useState<ExperienceFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    category: initialData.category || '',
    duration_minutes: initialData.duration_minutes || 60,
    max_group_size: initialData.max_group_size || 10,
    min_group_size: initialData.min_group_size || 1,
    price_per_person: initialData.price_per_person || 0,
    currency: initialData.currency || 'USD',
    location: initialData.location || '',
    meeting_point: initialData.meeting_point || '',
    coordinates: initialData.coordinates || null,
    included: initialData.included || [],
    not_included: initialData.not_included || [],
    requirements: initialData.requirements || [],
    highlights: initialData.highlights || [],
    cancellation_policy: initialData.cancellation_policy || 'Flexible',
    languages: initialData.languages || ['English'],
    tags: initialData.tags || [],
    images: initialData.images || [],
    is_active: initialData.is_active !== undefined ? initialData.is_active : true,
    is_bookable_online: initialData.is_bookable_online !== undefined ? initialData.is_bookable_online : true,
    is_shareable: initialData.is_shareable !== undefined ? initialData.is_shareable : true,
    booking_notice_hours: initialData.booking_notice_hours ? 
      (typeof initialData.booking_notice_hours === 'string' && initialData.booking_notice_hours.includes(':') ? 
        parseInt(initialData.booking_notice_hours.split(':')[0]) : 
        initialData.booking_notice_hours) : 24,
    available_dates: initialData.available_dates || [],
  })

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    let fieldValue: string | number | boolean = value
    
    // Convert number inputs to actual numbers
    if (type === 'number') {
      fieldValue = value === '' ? 0 : parseFloat(value)
    } else if (type === 'checkbox') {
      fieldValue = (e.target as HTMLInputElement).checked
    }
    
    setFormData({ ...formData, [name]: fieldValue })
  }

  // Handle input lists (included, not_included, requirements, highlights)
  const [listInputs, setListInputs] = useState({
    included: '',
    not_included: '',
    requirements: '',
    highlights: '',
    tags: '',
    languages: ''
  })

  const handleListInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setListInputs({
      ...listInputs,
      [name]: value
    })
  }

  const addListItem = (listName: 'included' | 'not_included' | 'requirements' | 'highlights' | 'tags' | 'languages') => {
    const value = listInputs[listName].trim()
    if (!value) return

    if (!formData[listName].includes(value)) {
      setFormData({
        ...formData,
        [listName]: [...formData[listName], value]
      })
    }

    setListInputs({
      ...listInputs,
      [listName]: ''
    })
  }

  const removeListItem = (listName: 'included' | 'not_included' | 'requirements' | 'highlights' | 'tags' | 'languages', index: number) => {
    setFormData({
      ...formData,
      [listName]: formData[listName].filter((_, i) => i !== index)
    })
  }

  // File upload handlers
  const handleFilesDrop = useCallback((acceptedFiles: File[]) => {
    // Filter for image files and limit to a reasonable number (e.g., 10)
    const imageFiles = acceptedFiles.filter(
      file => file.type.startsWith('image/')
    ).slice(0, 10)
    
    setSelectedFiles(prev => [...prev, ...imageFiles])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageFiles]
    }))
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleFilesDrop,
    accept: { 'image/*': [] }
  })

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Handle drag and drop reordering of images
  const handleDragStart = (index: number) => {
    setDraggingIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggingIndex === null || draggingIndex === index) return
    
    // Reorder the images array
    const newImages = [...formData.images]
    const draggedImage = newImages[draggingIndex]
    newImages.splice(draggingIndex, 1)
    newImages.splice(index, 0, draggedImage)
    
    setFormData({
      ...formData,
      images: newImages
    })
    
    setDraggingIndex(index)
  }

  const handleDragEnd = () => {
    setDraggingIndex(null)
  }

  // Handle AI description enhancement
  const enhanceWithAI = async () => {
    if (!formData.description || formData.description.length < 10) {
      setErrorMessage('Please provide at least a brief description to enhance')
      return
    }

    setIsSubmitting(true)
    try {
      // This is a placeholder for your AI enhancement call
      // In a real implementation, you would call your backend API
      const response = await fetch('/api/enhance-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          description: formData.description,
          name: formData.name,
          category: formData.category
        })
      })
      
      if (!response.ok) throw new Error('Failed to enhance description')
      
      const data = await response.json()
      setFormData({
        ...formData,
        description: data.enhancedDescription
      })
      
      setSuccessMessage('Description enhanced successfully!')
    } catch (error) {
      console.error('Error enhancing description:', error)
      setErrorMessage('Failed to enhance description. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')
    
    try {
      const data = new FormData()
      
      // Add all form values to the FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          // Handle images separately
          return
        }
        
        if (key === 'coordinates' && value) {
          // Handle coordinates as JSON
          data.append(key, JSON.stringify(value))
        } else if (key === 'available_dates') {
          // Only add available_dates if it has values
          if (Array.isArray(value) && value.length > 0) {
            data.append(key, JSON.stringify(value))
          }
        } else if (key === 'booking_notice_hours') {
          // Convert booking_notice_hours to proper time format (HH:MM:SS)
          const hoursValue = parseInt(value.toString());
          const hours = isNaN(hoursValue) ? 24 : hoursValue;
          // Format as HH:00:00 time string
          const timeString = `${hours.toString().padStart(2, '0')}:00:00`;
          data.append(key, timeString)
        } else if (Array.isArray(value)) {
          // Handle arrays by appending each item individually
          value.forEach(item => {
            data.append(key, item !== null ? item.toString() : '')
          })
        } else if (value !== undefined && value !== null) {
          data.append(key, value.toString())
        } else if (value === null) {
          data.append(key, '')
        }
      })
      
      // Handle images
      if (formData.images && Array.isArray(formData.images)) {
        formData.images.forEach((image, index) => {
          if (!image) {
            // Skip null or undefined images
            return;
          }
          
          if (image instanceof File) {
            data.append(`image_${index}`, image)
          } else if (typeof image === 'string') {
            data.append('existing_images', image)
          }
        })
      }
      
      // Create or update the experience based on mode
      if (mode === 'create') {
        await createExperience(data)
        setSuccessMessage('Experience created successfully!')
      } else if (mode === 'edit' && experienceId) {
        await updateExperience(experienceId, data)
        setSuccessMessage('Experience updated successfully!')
      }
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push('/experiences')
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error('Error submitting experience:', error)
      setErrorMessage('Failed to submit experience. Please check your inputs and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Tab definitions
  const tabs = [
    { name: 'Basic Info', icon: Info },
    { name: 'Details', icon: List },
    { name: 'Media', icon: Camera },
    { name: 'Booking', icon: Calendar }
  ]

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      {/* Success/Error messages */}
      {successMessage && (
        <div className="p-4 mb-4 bg-green-50 border border-green-100 text-green-800 rounded-lg">
          <p className="flex items-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            {successMessage}
          </p>
        </div>
      )}
      
      {errorMessage && (
        <div className="p-4 mb-4 bg-red-50 border border-red-100 text-red-800 rounded-lg">
          <p className="flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            {errorMessage}
          </p>
        </div>
      )}
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Tab.Group selectedIndex={currentTab} onChange={setCurrentTab}>
          {/* Tab navigation */}
          <div className="border-b">
            <Tab.List className="flex overflow-x-auto bg-gray-50 rounded-t-xl">
              {tabs.map((tab, index) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) => clsx(
                    'flex items-center py-4 px-6 font-medium text-sm whitespace-nowrap focus:outline-none',
                    selected
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  )}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>
          </div>

          <Tab.Panels className="p-6">
            {/* Tab 1: Basic Info */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter a compelling title"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      A clear, descriptive name (50-60 characters recommended)
                    </p>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category</option>
                      {EXPERIENCE_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose the most relevant category for your experience
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                        onClick={enhanceWithAI}
                        disabled={isSubmitting}
                      >
                        <PencilLine className="w-3 h-3 mr-1" />
                        Enhance with AI
                      </button>
                    </div>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your experience in detail"
                      required
                    ></textarea>
                    <p className="mt-1 text-sm text-gray-500">
                      Rich, engaging description of what customers will experience (300+ words recommended)
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <input
                          id="location"
                          name="location"
                          type="text"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, Country"
                          required
                        />
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
                        >
                          <Map className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        General area where the experience takes place
                      </p>
                    </div>

                    <div>
                      <label htmlFor="meeting_point" className="block text-sm font-medium text-gray-700 mb-1">
                        Meeting Point
                      </label>
                      <input
                        id="meeting_point"
                        name="meeting_point"
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.meeting_point}
                        onChange={handleChange}
                        placeholder="Specific meeting location"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Exact location where customers should meet you
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => router.push('/experiences')}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setCurrentTab(1)}
                  >
                    Next: Details
                  </button>
                </div>
              </div>
            </Tab.Panel>

            {/* Tab 2: Details */}
            <Tab.Panel>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (minutes) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="duration_minutes"
                        name="duration_minutes"
                        type="number"
                        min="15"
                        step="15"
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.duration_minutes}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      How long the experience lasts
                    </p>
                  </div>

                  <div>
                    <label htmlFor="min_group_size" className="block text-sm font-medium text-gray-700 mb-1">
                      Min Group Size <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="min_group_size"
                        name="min_group_size"
                        type="number"
                        min="1"
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.min_group_size}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Minimum number of participants
                    </p>
                  </div>

                  <div>
                    <label htmlFor="max_group_size" className="block text-sm font-medium text-gray-700 mb-1">
                      Max Group Size <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Users className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="max_group_size"
                        name="max_group_size"
                        type="number"
                        min={formData.min_group_size}
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.max_group_size}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Maximum number of participants
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="price_per_person" className="block text-sm font-medium text-gray-700 mb-1">
                      Price Per Person <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="price_per_person"
                        name="price_per_person"
                        type="number"
                        min="0"
                        step="0.01"
                        className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={formData.price_per_person}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Cost per participant
                    </p>
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.currency}
                      onChange={handleChange}
                      required
                    >
                      {CURRENCY_OPTIONS.map(currency => (
                        <option key={currency.code} value={currency.code}>{currency.label}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Currency for pricing
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="cancellation_policy" className="block text-sm font-medium text-gray-700 mb-1">
                      Cancellation Policy <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="cancellation_policy"
                      name="cancellation_policy"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={formData.cancellation_policy}
                      onChange={handleChange}
                      required
                    >
                      {CANCELLATION_POLICIES.map(policy => (
                        <option key={policy.value} value={policy.value}>{policy.value}</option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      {CANCELLATION_POLICIES.find(p => p.value === formData.cancellation_policy)?.description}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Languages
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        name="languages"
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={listInputs.languages}
                        onChange={handleListInputChange}
                        placeholder="Add language"
                        list="language-options"
                      />
                      <datalist id="language-options">
                        {LANGUAGE_OPTIONS.map(lang => (
                          <option key={lang} value={lang} />
                        ))}
                      </datalist>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => addListItem('languages')}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {formData.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {language}
                          <button
                            type="button"
                            className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                            onClick={() => removeListItem('languages', index)}
                          >
                            <span className="sr-only">Remove {language}</span>
                            <XCircle className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      name="tags"
                      type="text"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      value={listInputs.tags}
                      onChange={handleListInputChange}
                      placeholder="Add tag (e.g., outdoor, family-friendly)"
                    />
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      onClick={() => addListItem('tags')}
                    >
                      <PlusCircle className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-500 focus:outline-none"
                          onClick={() => removeListItem('tags', index)}
                        >
                          <span className="sr-only">Remove {tag}</span>
                          <XCircle className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Highlights</h3>
                    <div className="flex space-x-2 mb-2">
                      <input
                        name="highlights"
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={listInputs.highlights}
                        onChange={handleListInputChange}
                        placeholder="Add a highlight"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => addListItem('highlights')}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {formData.highlights.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckSquare className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-700">{item}</p>
                          </div>
                          <button
                            type="button"
                            className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                            onClick={() => removeListItem('highlights', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-xs text-gray-500">
                      Key selling points of your experience
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">What's Included</h3>
                    <div className="flex space-x-2 mb-2">
                      <input
                        name="included"
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={listInputs.included}
                        onChange={handleListInputChange}
                        placeholder="Add an included item"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => addListItem('included')}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {formData.included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckSquare className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-700">{item}</p>
                          </div>
                          <button
                            type="button"
                            className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                            onClick={() => removeListItem('included', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Not Included</h3>
                    <div className="flex space-x-2 mb-2">
                      <input
                        name="not_included"
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={listInputs.not_included}
                        onChange={handleListInputChange}
                        placeholder="Add a non-included item"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => addListItem('not_included')}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {formData.not_included.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <XCircle className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-700">{item}</p>
                          </div>
                          <button
                            type="button"
                            className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                            onClick={() => removeListItem('not_included', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Requirements</h3>
                    <div className="flex space-x-2 mb-2">
                      <input
                        name="requirements"
                        type="text"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        value={listInputs.requirements}
                        onChange={handleListInputChange}
                        placeholder="Add a requirement"
                      />
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        onClick={() => addListItem('requirements')}
                      >
                        <PlusCircle className="h-5 w-5" />
                      </button>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {formData.requirements.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <Info className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm text-gray-700">{item}</p>
                          </div>
                          <button
                            type="button"
                            className="ml-2 flex-shrink-0 text-red-500 hover:text-red-700"
                            onClick={() => removeListItem('requirements', index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setCurrentTab(0)}
                  >
                    Previous: Basic Info
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setCurrentTab(2)}
                  >
                    Next: Media
                  </button>
                </div>
              </div>
            </Tab.Panel>

            {/* Tab 3: Media */}
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Experience Photos</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload high-quality images that showcase your experience. The first image will be used as the main photo.
                  </p>

                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Drag and drop files here, or click to select files
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB each • Maximum 10 images
                    </p>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Images</h4>
                      <p className="text-xs text-gray-500 mb-4">
                        Drag and drop to reorder images. The first image will be used as the main photo.
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div
                            key={index}
                            className={`relative rounded-lg overflow-hidden border shadow-sm ${
                              draggingIndex === index ? 'opacity-50' : ''
                            } ${index === 0 ? 'ring-2 ring-blue-500' : ''}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="relative aspect-w-4 aspect-h-3">
                              {typeof image === 'string' ? (
                                <Image 
                                  src={image} 
                                  alt={`Experience image ${index+1}`}
                                  width={400}
                                  height={300}
                                  className="object-cover"
                                />
                              ) : (
                                <Image 
                                  src={URL.createObjectURL(image)} 
                                  alt={`Experience image ${index+1}`}
                                  width={400}
                                  height={300}
                                  className="object-cover"
                                />
                              )}
                              
                              {index === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-md">
                                  Main Photo
                                </div>
                              )}
                              
                              <button
                                type="button"
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
                                onClick={() => removeImage(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setCurrentTab(1)}
                  >
                    Previous: Details
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => setCurrentTab(3)}
                  >
                    Next: Booking
                  </button>
                </div>
              </div>
            </Tab.Panel>

            {/* Tab 4: Booking */}
            <Tab.Panel>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Booking Settings</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Configure how customers can book your experience.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Enable Online Booking</h4>
                        <p className="text-sm text-gray-500">
                          Allow customers to book this experience online
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="is_bookable_online"
                          name="is_bookable_online"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.is_bookable_online}
                          onChange={handleChange}
                        />
                        <label htmlFor="is_bookable_online" className="ml-2 text-sm text-gray-900">
                          {formData.is_bookable_online ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Shareable Experience</h4>
                        <p className="text-sm text-gray-500">
                          Generate a public link that can be shared with anyone
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="is_shareable"
                          name="is_shareable"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.is_shareable}
                          onChange={handleChange}
                        />
                        <label htmlFor="is_shareable" className="ml-2 text-sm text-gray-900">
                          {formData.is_shareable ? 'Enabled' : 'Disabled'}
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Publish Experience</h4>
                        <p className="text-sm text-gray-500">
                          Make this experience visible to customers
                        </p>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="is_active"
                          name="is_active"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.is_active}
                          onChange={handleChange}
                        />
                        <label htmlFor="is_active" className="ml-2 text-sm text-gray-900">
                          {formData.is_active ? 'Published' : 'Draft'}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="booking_notice_hours" className="block text-sm font-medium text-gray-700 mb-1">
                        Booking Notice (hours)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          id="booking_notice_hours"
                          name="booking_notice_hours"
                          type="number"
                          min="0"
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          value={formData.booking_notice_hours}
                          onChange={handleChange}
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        How many hours in advance customers must book (e.g., 24 = day before)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setCurrentTab(2)}
                  >
                    Previous: Media
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {mode === 'create' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>{mode === 'create' ? 'Create Experience' : 'Update Experience'}</>
                    )}
                  </button>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </form>
    </div>
  )
}
