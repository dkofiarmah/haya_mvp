import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Filter, Search } from "lucide-react"
import { PaymentsList } from "@/components/payments-list"

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground mt-1">Manage your payments and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>Create Invoice</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,685.00</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14,350.00</div>
            <p className="text-xs text-muted-foreground">5 invoices pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Booking Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$5,840.00</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search payments..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All Transactions
            <Badge variant="secondary" className="ml-2">
              48
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2">
              36
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="refunded">
            Refunded
            <Badge variant="secondary" className="ml-2">
              4
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-6">
          <PaymentsList />
        </TabsContent>
        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Payments</CardTitle>
              <CardDescription>Payments that have been successfully processed</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Completed payments content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Payments</CardTitle>
              <CardDescription>Payments that are awaiting processing or confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Pending payments content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="refunded" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Refunded Payments</CardTitle>
              <CardDescription>Payments that have been refunded to customers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Refunded payments content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
