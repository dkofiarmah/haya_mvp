import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TeamMembers() {
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@luxtour.com",
      role: "Admin",
      avatar: "SJ",
      status: "active",
      lastActive: "Just now",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@luxtour.com",
      role: "Manager",
      avatar: "MC",
      status: "active",
      lastActive: "5 minutes ago",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily@luxtour.com",
      role: "Agent",
      avatar: "ER",
      status: "active",
      lastActive: "1 hour ago",
    },
    {
      id: 4,
      name: "David Kim",
      email: "david@luxtour.com",
      role: "Agent",
      avatar: "DK",
      status: "active",
      lastActive: "3 hours ago",
    },
    {
      id: 5,
      name: "Jessica Patel",
      email: "jessica@luxtour.com",
      role: "Agent",
      avatar: "JP",
      status: "inactive",
      lastActive: "2 days ago",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Manage your team members and their access permissions.</CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Team Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search team members..." className="w-full pl-8" />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
            <div className="col-span-5">Name</div>
            <div className="col-span-3">Role</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-1"></div>
          </div>
          {teamMembers.map((member) => (
            <div key={member.id} className="grid grid-cols-12 items-center border-b p-4 last:border-0">
              <div className="col-span-5 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>{member.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.email}</div>
                </div>
              </div>
              <div className="col-span-3">
                {member.role === "Admin" ? (
                  <Badge className="bg-primary text-primary-foreground">Admin</Badge>
                ) : member.role === "Manager" ? (
                  <Badge variant="secondary">Manager</Badge>
                ) : (
                  <Badge variant="outline">Agent</Badge>
                )}
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  {member.status === "active" ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      <span className="text-sm">Active</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                      <span className="text-sm">Inactive</span>
                    </>
                  )}
                  <span className="text-xs text-muted-foreground">• {member.lastActive}</span>
                </div>
              </div>
              <div className="col-span-1 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Deactivate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
