'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface TagInputProps {
  placeholder?: string
  tags: string[]
  setTags: (tags: string[]) => void
  disabled?: boolean
}

export function TagInput({ placeholder, tags, setTags, disabled = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
      e.preventDefault()
      const newTag = inputValue.trim()
      
      // Don't add duplicate tags
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag])
      }
      
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      e.preventDefault()
      const newTags = [...tags]
      newTags.pop()
      setTags(newTags)
    }
  }

  const removeTag = (tag: string) => {
    const newTags = tags.filter(t => t !== tag)
    setTags(newTags)
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          {tag}
          <button 
            type="button" 
            onClick={() => removeTag(tag)}
            disabled={disabled}
            className="hover:bg-muted p-0.5 rounded-full"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder={tags.length === 0 ? placeholder : undefined}
        disabled={disabled}
        className="flex-1 border-0 p-0 text-sm outline-none focus-visible:ring-0"
      />
    </div>
  )
}
