"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface ComboboxOption {
  label: string
  value: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  selected: string[]
  onChange: (values: string[]) => void
  placeholder?: string
  multiple?: boolean
  searchable?: boolean
  creatable?: boolean
  className?: string
  badgeClassName?: string
}

export function Combobox({
  options,
  selected,
  onChange,
  placeholder = "Select option",
  multiple = false,
  searchable = false,
  creatable = false,
  className,
  badgeClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  
  // Check if there are any values that aren't in the options list (custom added)
  const customValues = selected.filter(
    value => !options.some(option => option.value === value)
  )
  
  // Combine standard options with any custom values
  const allOptions = [
    ...options,
    ...customValues.map(value => ({ label: value, value }))
  ]
  
  const handleSelect = (value: string) => {
    if (multiple) {
      const newSelected = selected.includes(value)
        ? selected.filter(item => item !== value)
        : [...selected, value]
      onChange(newSelected)
    } else {
      onChange([value])
      setOpen(false)
    }
    setInputValue("")
  }
  
  const handleCreateOption = () => {
    if (!inputValue.trim() || selected.includes(inputValue)) return
    
    onChange([...selected, inputValue.trim()])
    setInputValue("")
  }
  
  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent the popover from opening
    onChange(selected.filter(item => item !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selected.length > 0 && multiple ? (
            <div className="flex gap-1 flex-wrap max-w-[90%]">
              {selected.slice(0, 2).map((value) => {
                const selectedOption = allOptions.find(option => option.value === value)
                return (
                  <Badge 
                    key={value} 
                    variant="secondary"
                    className={cn("mr-1 mb-1", badgeClassName)}
                  >
                    {selectedOption?.label ?? value}
                    {multiple && (
                      <span
                        role="button"
                        tabIndex={0}
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer inline-flex"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => handleRemove(value, e)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleRemove(value, e as unknown as React.MouseEvent)
                          }
                        }}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {selectedOption?.label ?? value}</span>
                      </span>
                    )}
                  </Badge>
                )
              })}
              {selected.length > 2 && (
                <Badge variant="secondary">
                  +{selected.length - 2} more
                </Badge>
              )}
            </div>
          ) : selected.length === 1 ? (
            allOptions.find(option => option.value === selected[0])?.label ?? selected[0]
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {searchable && (
            <CommandInput 
              placeholder={`Search${creatable ? " or create new" : ""}...`}
              value={inputValue}
              onValueChange={setInputValue}
            />
          )}
          <CommandList>
            <CommandEmpty>
              {creatable && inputValue ? (
                <Button 
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleCreateOption}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create "{inputValue}"
                </Button>
              ) : (
                "No options found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {allOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {creatable && inputValue && !options.some(option => 
              option.value.toLowerCase() === inputValue.toLowerCase() || 
              option.label.toLowerCase() === inputValue.toLowerCase()
            ) && (
              <CommandGroup>
                <CommandItem
                  onSelect={handleCreateOption}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create "{inputValue}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
