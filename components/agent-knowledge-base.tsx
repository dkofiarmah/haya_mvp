import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Check, FileText, PlusCircle, Search, Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function AgentKnowledgeBase({ agentId }: { agentId: string }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Access</CardTitle>
          <CardDescription>Configure which knowledge sources this agent can access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Experiences Database</Label>
                <p className="text-sm text-muted-foreground">Access to all experiences in the knowledge base</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Accommodations Database</Label>
                <p className="text-sm text-muted-foreground">Access to all accommodations in the knowledge base</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Partners Database</Label>
                <p className="text-sm text-muted-foreground">Access to all partners in the knowledge base</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Destination Guides</Label>
                <p className="text-sm text-muted-foreground">Access to destination guides and information</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Client History</Label>
                <p className="text-sm text-muted-foreground">Access to client booking history and preferences</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pricing Information</Label>
                <p className="text-sm text-muted-foreground">Access to pricing and availability information</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custom Knowledge</CardTitle>
          <CardDescription>Add custom knowledge sources for this specific agent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="documents" className="space-y-4">
            <TabsList>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="qa">Q&A Pairs</TabsTrigger>
              <TabsTrigger value="urls">URLs</TabsTrigger>
            </TabsList>
            <TabsContent value="documents" className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search documents..." className="w-full pl-8" />
                </div>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
                  <div className="col-span-5">Document</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-2">Size</div>
                  <div className="col-span-2">Status</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-5 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Discovery Agent Guidelines.pdf</span>
                    </div>
                    <div className="col-span-3">PDF Document</div>
                    <div className="col-span-2">1.2 MB</div>
                    <div className="col-span-2 flex items-center gap-1">
                      <Badge className="bg-green-500/10 text-green-500">
                        <Check className="mr-1 h-3 w-3" />
                        Indexed
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-5 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Luxury Travel Trends 2025.docx</span>
                    </div>
                    <div className="col-span-3">Word Document</div>
                    <div className="col-span-2">845 KB</div>
                    <div className="col-span-2 flex items-center gap-1">
                      <Badge className="bg-green-500/10 text-green-500">
                        <Check className="mr-1 h-3 w-3" />
                        Indexed
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-5 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Client Preference Questions.xlsx</span>
                    </div>
                    <div className="col-span-3">Excel Spreadsheet</div>
                    <div className="col-span-2">512 KB</div>
                    <div className="col-span-2 flex items-center gap-1">
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                        Processing
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="qa" className="space-y-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Q&A Pair
              </Button>

              <div className="space-y-4">
                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">Q: What is the best time to visit Bali?</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    A: The best time to visit Bali is during the dry season, which runs from April to October. During
                    these months, you'll experience less rainfall, lower humidity, and more sunshine, making it ideal
                    for beach activities and outdoor explorations. The peak tourist season is in July and August, so if
                    you prefer fewer crowds, consider visiting in May, June, or September.
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">Q: What luxury accommodations do you recommend in Santorini?</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    A: In Santorini, we highly recommend several luxury accommodations: Canaves Oia Suites offers
                    stunning caldera views and private plunge pools; Grace Hotel Santorini features minimalist design
                    and exceptional service; Mystique Hotel provides cave-style suites with panoramic sea views;
                    Andronis Luxury Suites offers elegant accommodations with infinity pools; and Katikies Hotel
                    features whitewashed perfection with multiple infinity pools. All these properties offer
                    personalized service, gourmet dining, and spectacular sunset views.
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">Q: What documentation is required for a safari in Tanzania?</div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    A: For a safari in Tanzania, you'll need a valid passport with at least six months validity beyond
                    your travel dates and at least two blank pages. Most visitors require a tourist visa, which can be
                    obtained online through the Tanzania e-visa portal or upon arrival at major entry points. You'll
                    also need proof of yellow fever vaccination if you're arriving from a country with risk of yellow
                    fever transmission. We recommend travel insurance that covers medical evacuation, and it's advisable
                    to carry copies of your prescriptions if you're bringing medication.
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="urls" className="space-y-4">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add URL
              </Button>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
                  <div className="col-span-6">URL</div>
                  <div className="col-span-3">Last Crawled</div>
                  <div className="col-span-3">Status</div>
                </div>
                <div className="divide-y">
                  <div className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-6 truncate">https://www.bali-tourism-board.com/luxury-experiences</div>
                    <div className="col-span-3">2 days ago</div>
                    <div className="col-span-3 flex items-center gap-1">
                      <Badge className="bg-green-500/10 text-green-500">
                        <Check className="mr-1 h-3 w-3" />
                        Indexed
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-6 truncate">
                      https://www.santorini-island.com/luxury-accommodations.html
                    </div>
                    <div className="col-span-3">1 week ago</div>
                    <div className="col-span-3 flex items-center gap-1">
                      <Badge className="bg-green-500/10 text-green-500">
                        <Check className="mr-1 h-3 w-3" />
                        Indexed
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 items-center p-4">
                    <div className="col-span-6 truncate">https://www.japan-guide.com/e/e2164.html</div>
                    <div className="col-span-3">3 days ago</div>
                    <div className="col-span-3 flex items-center gap-1">
                      <Badge variant="outline" className="border-amber-500 text-amber-500">
                        <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                        Crawling
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Knowledge Base Usage</span>
              <span className="text-sm text-muted-foreground">2.4 GB of 5 GB</span>
            </div>
            <Progress value={48} className="h-2" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
