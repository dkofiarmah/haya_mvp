'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { deleteExperience } from '@/app/actions/experiences'
import { 
  Clock, 
  MapPin, 
  MoreVertical, 
  Plus, 
  Search, 
  Users 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabaseClient } from '@/lib/supabase/auth-client'
import { useToast } from '@/components/ui/use-toast'

type Experience = {
  id: string
  org_id: string
  name: string
  description: string
  category: string
  location: string
  price_per_person: number
  duration_minutes: number
  max_group_size: number
  min_group_size: number
  images: string[] | null
  is_active: boolean
  tags: string[] | null
  coordinates: any | null
  meta_data: any | null
  cancellation_policy: string
  created_at: string
  updated_at: string
}

interface ExperiencesListProps {
  experiences: Experience[]
}

export function ExperiencesList({ experiences: initialExperiences }: ExperiencesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences || [])
  const [loading, setLoading] = useState(initialExperiences ? false : true)
  const { toast } = useToast()
  
  // Fetch experiences from Supabase if not provided via props
  useEffect(() => {
    if (!initialExperiences) {
      fetchExperiences()
    }
  }, [initialExperiences])
  
  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabaseClient
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw error
      }
      
      setExperiences(data || [])
    } catch (error) {
      console.error('Error fetching experiences:', error)
      toast({
        title: 'Error',
        description: 'Failed to load experiences. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Filter by search query
  const filteredExperiences = experiences.filter(exp => 
    exp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  // Further filter by tab
  const displayedExperiences = filteredExperiences.filter(exp => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') return exp.is_active
    if (activeTab === 'inactive') return !exp.is_active
    return true
  })
  
  const handleDeleteExperience = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      try {
        await deleteExperience(id)
      } catch (error) {
        console.error('Error deleting experience:', error)
      }
    }
  }
  
  const categories = Array.from(new Set(experiences.map(exp => exp.category)))
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Loading Experiences...</h2>
        <p className="text-muted-foreground mb-6">
          Please wait while we load the experiences for you.
        </p>
      </div>
    )
  }
  
  if (!experiences || experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No Experiences Found</h2>
        <p className="text-muted-foreground mb-6">
          Start by creating your first experience to offer to your customers.
        </p>
        <Link href="/experiences/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Experience
          </Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search experiences..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Link href="/experiences/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({experiences.length})</TabsTrigger>
          <TabsTrigger value="active">
            Active ({experiences.filter(exp => exp.is_active).length})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({experiences.filter(exp => !exp.is_active).length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedExperiences.map((experience) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                onDelete={handleDeleteExperience} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedExperiences.map((experience) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                onDelete={handleDeleteExperience} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedExperiences.map((experience) => (
              <ExperienceCard 
                key={experience.id} 
                experience={experience} 
                onDelete={handleDeleteExperience} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      {displayedExperiences.length === 0 && (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No experiences match your filters</p>
        </div>
      )}
    </div>
  )
}

function ExperienceCard({ 
  experience, 
  onDelete 
}: { 
  experience: Experience
  onDelete: (id: string) => void 
}) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48">
        {experience.images && experience.images.length > 0 ? (
          <img
            src={experience.images[0]}
            alt={experience.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No image</p>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/experiences/${experience.id}`}>View Details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/experiences/${experience.id}/edit`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(experience.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="absolute top-2 left-2">
          <Badge 
            variant={experience.is_active ? "default" : "secondary"}
            className={cn(
              "capitalize",
              !experience.is_active && "bg-muted text-muted-foreground"
            )}
          >
            {experience.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="absolute bottom-2 left-2">
          <Badge variant="outline" className="bg-background/80 capitalize">
            {experience.category}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{experience.name}</CardTitle>
        <CardDescription className="line-clamp-1">
          {experience.location}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {experience.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {experience.duration_minutes >= 60 
              ? `${Math.floor(experience.duration_minutes / 60)}h ${experience.duration_minutes % 60}m` 
              : `${experience.duration_minutes}m`}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3 w-3 mr-1" />
            {experience.max_group_size} pax
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            {experience.location.split(',')[0]}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <p className="font-medium">${experience.price_per_person.toFixed(2)}</p>
        <Link href={`/experiences/${experience.id}`}>
          <Button variant="outline" size="sm">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
