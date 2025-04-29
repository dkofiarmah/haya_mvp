import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, PlusCircle, Search } from "lucide-react"
import { PartnersList } from "@/components/partners-list"

export default function PartnersPage() {
  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partners</h2>
          <p className="text-muted-foreground">
            Manage your network of travel partners, suppliers, and service providers.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Partner
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search partners..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Partners
            <Badge variant="secondary" className="ml-2">
              35
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tour">
            Tour Operators
            <Badge variant="secondary" className="ml-2">
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="transport">
            Transportation
            <Badge variant="secondary" className="ml-2">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="activity">
            Activity Providers
            <Badge variant="secondary" className="ml-2">
              15
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <PartnersList />
        </TabsContent>
        <TabsContent value="tour" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Operators</CardTitle>
              <CardDescription>Local tour operators and guides.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Tour operators content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="transport" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transportation</CardTitle>
              <CardDescription>Transportation providers and services.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Transportation providers content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Providers</CardTitle>
              <CardDescription>Specialized activity and experience providers.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Activity providers content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
