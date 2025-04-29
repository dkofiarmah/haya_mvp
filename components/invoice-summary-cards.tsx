import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react"

export function InvoiceSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$45,231.89</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          <div className="mt-4 h-1 w-full rounded-full bg-muted">
            <div className="h-1 w-[75%] rounded-full bg-primary"></div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">-4 from last month</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-medium">Recent:</span>
            <span className="text-xs text-muted-foreground">INV-002, INV-007, INV-009</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Paid This Month</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$28,450.00</div>
          <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          <div className="mt-4 flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs">8 invoices paid on time</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">-2 from last month</p>
          <div className="mt-4 flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-destructive"></div>
            <span className="text-xs">$14,200.00 total overdue</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
