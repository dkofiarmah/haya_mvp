'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Bot, PaperclipIcon, Send, Sparkles, Wand } from "lucide-react"

// This component is dynamically imported with ssr: false in the page
export default function MessageFormContent() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
      {/* Compose area - takes 3/4 of the screen on large displays */}
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader className="px-4 py-3 border-b">
            <h3 className="font-medium text-lg">New Message</h3>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipient">To</Label>
                <Input id="recipient" placeholder="Select recipient..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Enter message subject..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="related-tour">Related Tour</Label>
                <Input id="related-tour" placeholder="Select a tour..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here..." className="min-h-[200px]" />
              </div>

              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm">
                  <PaperclipIcon className="mr-2 h-4 w-4" />
                  Attach Files
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline">
                    <Bot className="mr-2 h-4 w-4" />
                    AI Draft
                  </Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar tools - takes 1/4 of the screen on large displays */}
      <div className="space-y-6">
        <Tabs defaultValue="templates">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="ai">AI Assist</TabsTrigger>
          </TabsList>
          <TabsContent value="templates" className="mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Quick Templates</h4>
                  <Input placeholder="Select a template..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ai" className="mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">AI Message Options</h4>
                  <div className="grid gap-2">
                    <Button variant="outline" className="justify-start w-full">
                      <Wand className="mr-2 h-4 w-4" />
                      Generate Reply
                    </Button>
                    <Button variant="outline" className="justify-start w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Enhance Writing
                    </Button>
                    <Button variant="outline" className="justify-start w-full">
                      <Bot className="mr-2 h-4 w-4" />
                      Summarize Conversation
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
