import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Filter, Search } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { InvoiceSummaryCards } from "@/components/invoice-summary-cards"

export default function InvoicesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground mt-1">Manage and track all your customer invoices</p>
        </div>
        <div className="flex gap-2">
          <Link href="/invoices/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      <InvoiceSummaryCards />

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <TabsList>
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          <div className="flex w-full items-center gap-2 md:w-auto">
            <div className="relative flex-1 md:w-64 md:flex-none">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search invoices..." className="w-full bg-background pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader className="p-4">
              <div className="grid grid-cols-12 text-sm font-medium text-muted-foreground">
                <div className="col-span-4">Customer / Invoice</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/invoices/${invoice.id}`}
                  className="grid grid-cols-12 items-center border-b p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="col-span-4">
                    <div className="font-medium">{invoice.customer}</div>
                    <div className="text-sm text-muted-foreground">{invoice.invoiceNumber}</div>
                  </div>
                  <div className="col-span-2 text-sm">{invoice.date}</div>
                  <div className="col-span-2 text-sm">{invoice.dueDate}</div>
                  <div className="col-span-2 font-medium">{invoice.amount}</div>
                  <div className="col-span-2">
                    <InvoiceStatusBadge status={invoice.status} />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <div className="rounded-full bg-primary/20 p-2">
                  <Filter className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-medium mb-2">No draft invoices</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                You don't have any draft invoices at the moment. Create a new invoice to get started.
              </p>
              <Link href="/invoices/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents would be similar */}
      </Tabs>
    </div>
  )
}

// Sample data
const invoices = [
  {
    id: "inv-001",
    customer: "Sarah Johnson",
    invoiceNumber: "INV-001",
    date: "Apr 12, 2025",
    dueDate: "May 12, 2025",
    amount: "$11,385.00",
    status: "paid",
  },
  {
    id: "inv-002",
    customer: "Michael Chen",
    invoiceNumber: "INV-002",
    date: "Apr 15, 2025",
    dueDate: "May 15, 2025",
    amount: "$8,750.00",
    status: "pending",
  },
  {
    id: "inv-003",
    customer: "Emma Rodriguez",
    invoiceNumber: "INV-003",
    date: "Apr 18, 2025",
    dueDate: "May 18, 2025",
    amount: "$14,200.00",
    status: "overdue",
  },
  {
    id: "inv-004",
    customer: "David Smith",
    invoiceNumber: "INV-004",
    date: "Apr 20, 2025",
    dueDate: "May 20, 2025",
    amount: "$6,850.00",
    status: "draft",
  },
  {
    id: "inv-005",
    customer: "Olivia Williams",
    invoiceNumber: "INV-005",
    date: "Apr 22, 2025",
    dueDate: "May 22, 2025",
    amount: "$9,300.00",
    status: "paid",
  },
]
