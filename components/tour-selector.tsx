"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const tours = [
  {
    id: "1",
    name: "Bali Luxury Retreat",
    dates: "July 15 - July 25, 2023",
  },
  {
    id: "2",
    name: "Paris Getaway",
    dates: "August 5 - August 12, 2023",
  },
  {
    id: "3",
    name: "Tokyo Adventure",
    dates: "September 10 - September 20, 2023",
  },
  {
    id: "4",
    name: "African Safari",
    dates: "October 1 - October 10, 2023",
  },
  {
    id: "5",
    name: "European Heritage Tour",
    dates: "November 5 - November 15, 2023",
  },
]

export function TourSelector() {
  const [open, setOpen] = useState(false)
  const [selectedTour, setSelectedTour] = useState<(typeof tours)[0] | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedTour ? (
            <div>
              <span>{selectedTour.name}</span>
              <span className="text-xs text-muted-foreground block">{selectedTour.dates}</span>
            </div>
          ) : (
            "Select related tour..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search tours..." />
          <CommandList>
            <CommandEmpty>No tour found.</CommandEmpty>
            <CommandGroup>
              {tours.map((tour) => (
                <CommandItem
                  key={tour.id}
                  value={tour.name}
                  onSelect={() => {
                    setSelectedTour(tour === selectedTour ? null : tour)
                    setOpen(false)
                  }}
                >
                  <div>
                    <p className="text-sm font-medium">{tour.name}</p>
                    <p className="text-xs text-muted-foreground">{tour.dates}</p>
                  </div>
                  <Check
                    className={cn("ml-auto h-4 w-4", selectedTour?.id === tour.id ? "opacity-100" : "opacity-0")}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
