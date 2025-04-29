"use client"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const templates = [
  {
    id: "1",
    title: "Welcome Message",
    content:
      "Dear [Customer Name],\n\nThank you for booking your [Tour Name] with us. We're excited to help you create unforgettable memories.\n\nIn the coming days, you'll receive detailed information about your itinerary, accommodations, and activities. In the meantime, please don't hesitate to reach out if you have any questions.\n\nWarm regards,\n[Your Name]\nLuxury Tour Concierge",
  },
  {
    id: "2",
    title: "Weather Update",
    content:
      "Dear [Customer Name],\n\nI wanted to provide you with an update on the weather forecast for your upcoming trip to [Destination].\n\nFor your arrival on [Date], we're expecting [Weather Conditions] with temperatures around [Temperature Range]. We recommend [Clothing/Preparation Advice].\n\nWe're monitoring conditions closely and will make any necessary adjustments to ensure your comfort and enjoyment.\n\nBest regards,\n[Your Name]\nLuxury Tour Concierge",
  },
  {
    id: "3",
    title: "Dietary Requirements Confirmation",
    content:
      "Dear [Customer Name],\n\nI'm writing to confirm that we've noted your dietary requirements ([Specific Requirements]) for your upcoming [Tour Name].\n\nAll restaurants and venues have been informed, and appropriate alternatives will be provided throughout your journey. If you have any additional preferences or concerns, please let us know.\n\nRegards,\n[Your Name]\nLuxury Tour Concierge",
  },
  {
    id: "4",
    title: "Transportation Options",
    content:
      "Dear [Customer Name],\n\nIn response to your inquiry about transportation options for your upcoming stay in [Destination], I'm pleased to present the following choices:\n\n1. [Option 1 details]\n2. [Option 2 details]\n3. [Option 3 details]\n\nPlease let me know which option you prefer, and I'll make the necessary arrangements.\n\nBest regards,\n[Your Name]\nLuxury Tour Concierge",
  },
]

export function TemplateSelector() {
  return (
    <div className="space-y-4">
      {templates.map((template, index) => (
        <div key={template.id}>
          <Card className="p-3 cursor-pointer hover:bg-muted/50" onClick={() => {}}>
            <h3 className="text-sm font-medium">{template.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.content}</p>
          </Card>
          {index < templates.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </div>
  )
}
