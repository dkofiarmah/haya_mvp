'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'
import { deleteExperience, duplicateExperience } from '@/app/actions/experiences'
import {
  CircleCheck,
  CircleX,
  Edit,
  Copy,
  Trash2,
  Share2,
  Clock,
  Users,
  Search,
  MoreVertical,
  Filter,
  ArrowUpDown,
  Eye
} from 'lucide-react'

// Define the Experience interface based on your schema
interface Experience {
  id: string;
  name: string;
  description?: string;
  category?: string;
  images?: string[] | null;
  location?: string;
  price_per_person: number;
  currency?: string;
  duration_minutes: number;
  max_group_size: number;
  min_group_size: number;
  is_active: boolean;
  [key: string]: any;
}

interface ExperiencesListViewProps {
  experiences: Experience[];
}

export default function ExperiencesListView({ experiences: initialExperiences }: ExperiencesListViewProps) {
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
  
  // Filter experiences based on search term
  const filteredExperiences = experiences.filter((exp) => 
    exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exp.description && exp.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exp.location && exp.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (exp.category && exp.category.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  // Handle sharing an experience
  const handleShare = (id: string, token: string) => {
    const url = `${window.location.origin}/experiences/share-redirect/${id}`
    navigator.clipboard.writeText(url)
    toast({
      title: 'Link Copied',
      description: 'Experience shareable link copied to clipboard',
    })
  }
  
  // Handle duplication of an experience
  const handleDuplicate = async (id: string) => {
    try {
      setIsDuplicating(id)
      const result = await duplicateExperience(id)
      toast({
        title: 'Experience Duplicated',
        description: 'A copy of the experience has been created',
      })
      router.refresh()
    } catch (error) {
      console.error('Failed to duplicate experience:', error)
      toast({
        title: 'Duplication Failed',
        description: 'There was an error duplicating the experience',
        variant: 'destructive',
      })
    } finally {
      setIsDuplicating(null)
    }
  }
  
  // Handle deletion of an experience
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience? This action cannot be undone.')) {
      return
    }
    
    try {
      setIsDeleting(id)
      await deleteExperience(id)
      setExperiences(experiences.filter(exp => exp.id !== id))
      toast({
        title: 'Experience Deleted',
        description: 'The experience has been permanently deleted',
      })
    } catch (error) {
      console.error('Failed to delete experience:', error)
      toast({
        title: 'Deletion Failed',
        description: 'There was an error deleting the experience',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(null)
    }
  }
  
  // Format the duration as human-readable
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}m` : ''}`
    }
    return `${minutes}m`
  }
  
  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search experiences..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 self-end">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </div>
      </div>
      
      {filteredExperiences.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-gray-500">No experiences found. Create your first experience.</p>
          <Button className="mt-4" asChild>
            <Link href="/experiences/new">Create Experience</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiences.map((experience) => (
            <Card key={experience.id} className="overflow-hidden">
              {/* Experience Image */}
              <div className="relative aspect-video">
                {experience.images && experience.images.length > 0 ? (
                  <Image
                    src={experience.images[0]}
                    alt={experience.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
                
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    experience.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {experience.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-1">{experience.name}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    {experience.location || 'No location set'}
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2">
                <div className="flex justify-between items-center text-sm mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(experience.duration_minutes)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {experience.min_group_size}-{experience.max_group_size} people
                  </div>
                </div>
                
                <div>
                  <p className="font-medium">
                    {formatCurrency(experience.price_per_person, experience.currency)}
                    <span className="text-gray-500 text-sm font-normal"> / person</span>
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/experiences/${experience.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/experiences/${experience.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/experiences/${experience.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => experience.shareable_token && handleShare(experience.id, experience.shareable_token)}
                      disabled={!experience.is_shareable || !experience.shareable_token}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDuplicate(experience.id)}
                      disabled={isDuplicating === experience.id}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {isDuplicating === experience.id ? 'Duplicating...' : 'Duplicate'}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDelete(experience.id)}
                      disabled={isDeleting === experience.id}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting === experience.id ? 'Deleting...' : 'Delete'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
