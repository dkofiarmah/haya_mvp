"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const customers = [
  {
    id: "1",
    name: "John Davis",
    email: "john.davis@example.com",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    avatar: "ET",
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "MC",
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "SJ",
  },
  {
    id: "5",
    name: "Robert Miller",
    email: "robert.miller@example.com",
    avatar: "RM",
  },
]

export function CustomerSelector() {
  const [open, setOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCustomer ? (
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src="/placeholder.svg?height=24&width=24" />
                <AvatarFallback>{selectedCustomer.avatar}</AvatarFallback>
              </Avatar>
              <span>{selectedCustomer.name}</span>
            </div>
          ) : (
            "Select customer..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search customers..." />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.name}
                  onSelect={() => {
                    setSelectedCustomer(customer === selectedCustomer ? null : customer)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="/placeholder.svg?height=24&width=24" />
                      <AvatarFallback>{customer.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0",
                    )}
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
