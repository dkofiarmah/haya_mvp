"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createAIAssistant, updateAIAssistant } from "@/lib/ai/ai-service"

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  description: z.string().optional(),
  personality: z.string().optional(),
  status: z.enum(["active", "inactive", "draft"]),
})

interface AIAssistantFormProps {
  assistant?: any
}

export function AIAssistantForm({ assistant }: AIAssistantFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with default values or existing assistant data
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: assistant?.name || "",
      role: assistant?.role || "",
      description: assistant?.description || "",
      personality: assistant?.personality || "",
      status: assistant?.status || "draft",
    },
  })

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      if (assistant) {
        // Update existing assistant
        await updateAIAssistant(assistant.id, values)
        toast({
          title: "AI Assistant Updated",
          description: "Your AI assistant has been updated successfully.",
        })
      } else {
        // Create new assistant
        const newAssistant = await createAIAssistant(values)
        toast({
          title: "AI Assistant Created",
          description: "Your new AI assistant has been created successfully.",
        })
        // Redirect to the new assistant's page
        router.push(`/ai-assistants/${newAssistant.id}`)
      }

      // Refresh the page data
      router.refresh()
    } catch (error) {
      console.error("Error saving AI assistant:", error)
      toast({
        title: "Error",
        description: "There was an error saving your AI assistant. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{assistant ? "Edit AI Assistant" : "Create AI Assistant"}</CardTitle>
            <CardDescription>
              {assistant
                ? "Update your AI assistant's configuration"
                : "Configure a new AI assistant for your luxury tour business"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Luxury Tour Guide" {...field} />
                  </FormControl>
                  <FormDescription>A friendly name for your AI assistant.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Tour Advisor" {...field} />
                  </FormControl>
                  <FormDescription>The primary role of this assistant.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. This assistant helps customers find the perfect luxury tour package."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>A brief description of what this assistant does.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personality</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g. Friendly, knowledgeable, and enthusiastic about luxury travel."
                      className="min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Define the personality traits of this assistant.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The current status of this assistant.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : assistant ? "Update Assistant" : "Create Assistant"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
