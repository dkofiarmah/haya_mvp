import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, Hotel, Info, MapPin, PaperclipIcon, Send, ThumbsUp, User } from "lucide-react"
import Link from "next/link"
import { MessageThread } from "@/components/message-thread"
import { CustomerInfo } from "@/components/customer-info"
import { TourInfo } from "@/components/tour-info"

export default function MessageConversationPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/messages">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to messages</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Conversation with John Davis</h1>
        <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-500">
          Flagged
        </Badge>
        <Badge variant="outline" className="capitalize">
          Email
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Message thread - takes 3/4 of the screen on large displays */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="px-4 py-3 border-b flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">John Davis</p>
                  <p className="text-xs text-muted-foreground">john.davis@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Last message: 2 hours ago</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <MessageThread conversationId={params.id} />
            </CardContent>
          </Card>

          {/* Message input */}
          <div className="flex items-end gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Type your message..."
                className="min-h-[80px] resize-none py-3 pl-4 pr-10"
                multiline="true"
              />
              <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 text-muted-foreground">
                <PaperclipIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">AI Draft</Button>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar information - takes 1/4 of the screen on large displays */}
        <div className="space-y-6">
          <Tabs defaultValue="customer">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="customer">
                <User className="mr-2 h-4 w-4" />
                Customer
              </TabsTrigger>
              <TabsTrigger value="tour">
                <MapPin className="mr-2 h-4 w-4" />
                Tour
              </TabsTrigger>
              <TabsTrigger value="actions">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Actions
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customer" className="mt-4">
              <CustomerInfo customerId="123" />
            </TabsContent>
            <TabsContent value="tour" className="mt-4">
              <TourInfo tourId="456" />
            </TabsContent>
            <TabsContent value="actions" className="mt-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Actions</h4>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start w-full">
                        <Hotel className="mr-2 h-4 w-4" />
                        Update Accommodation
                      </Button>
                      <Button variant="outline" className="justify-start w-full">
                        <Info className="mr-2 h-4 w-4" />
                        Send Weather Info
                      </Button>
                      <Button variant="secondary" className="justify-start w-full">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Approve AI Response
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Templates</h4>
                    <div className="grid gap-2">
                      <Button variant="outline" className="justify-start w-full">
                        Weather Update
                      </Button>
                      <Button variant="outline" className="justify-start w-full">
                        Transport Options
                      </Button>
                      <Button variant="outline" className="justify-start w-full">
                        Dietary Request Follow-up
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
