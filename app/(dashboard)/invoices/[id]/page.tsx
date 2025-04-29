import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InvoiceStatusBadge } from "@/components/invoice-status-badge"
import { ArrowLeft, Download, Edit, Mail, Printer, Share2 } from "lucide-react"
import Link from "next/link"

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the invoice data based on the ID
  const invoice = {
    id: params.id,
    invoiceNumber: "INV-001",
    date: "Apr 12, 2025",
    dueDate: "May 12, 2025",
    status: "pending" as const,
    customer: {
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      address: "123 Main Street, New York, NY 10001",
      phone: "+1 (555) 123-4567",
    },
    company: {
      name: "Luxury Tours Inc.",
      address: "456 Park Avenue, New York, NY 10022",
      email: "contact@luxurytours.com",
      phone: "+1 (555) 987-6543",
      website: "www.luxurytours.com",
    },
    items: [
      {
        description: "Bali Luxury Retreat - Tour Package",
        quantity: 2,
        unitPrice: "$4,850.00",
        amount: "$9,700.00",
      },
      {
        description: "Airport Transfer - Premium",
        quantity: 1,
        unitPrice: "$150.00",
        amount: "$150.00",
      },
      {
        description: "Travel Insurance - Premium Coverage",
        quantity: 2,
        unitPrice: "$250.00",
        amount: "$500.00",
      },
    ],
    subtotal: "$10,350.00",
    tax: "$1,035.00",
    total: "$11,385.00",
    amountPaid: "$0.00",
    balanceDue: "$11,385.00",
    notes:
      "Thank you for choosing our luxury tour services. We look forward to providing you with an unforgettable experience.",
    terms:
      "Payment is due within 30 days. Please make payment to the bank account details provided in the invoice. Cancellation policy applies as per our terms of service.",
    paymentDetails: {
      bankName: "Global Bank",
      accountName: "Luxury Tours Inc.",
      accountNumber: "1234567890",
      swiftCode: "GLBKUS12",
      routingNumber: "987654321",
    },
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Link href="/invoices">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoiceNumber}</h1>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Link href={`/invoices/${params.id}/edit`}>
            <Button size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{invoice.company.name}</h2>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {invoice.company.address}
                      <br />
                      {invoice.company.email}
                      <br />
                      {invoice.company.phone}
                      <br />
                      {invoice.company.website}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold mb-1">INVOICE</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Invoice Number:</span> {invoice.invoiceNumber}
                      <br />
                      <span className="font-medium">Date:</span> {invoice.date}
                      <br />
                      <span className="font-medium">Due Date:</span> {invoice.dueDate}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Bill To:</h3>
                    <p className="font-medium">{invoice.customer.name}</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {invoice.customer.address}
                      <br />
                      {invoice.customer.email}
                      <br />
                      {invoice.customer.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-right">Unit Price</div>
                      <div className="col-span-2 text-right">Amount</div>
                    </div>
                    {invoice.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 border-b p-4 text-sm last:border-0">
                        <div className="col-span-6">{item.description}</div>
                        <div className="col-span-2 text-center">{item.quantity}</div>
                        <div className="col-span-2 text-right">{item.unitPrice}</div>
                        <div className="col-span-2 text-right font-medium">{item.amount}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal:</span>
                      <span>{invoice.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tax (10%):</span>
                      <span>{invoice.tax}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-base font-bold">
                      <span>Total:</span>
                      <span>{invoice.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Amount Paid:</span>
                      <span>{invoice.amountPaid}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold">
                      <span>Balance Due:</span>
                      <span>{invoice.balanceDue}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Notes:</h3>
                    <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Terms & Conditions:</h3>
                    <p className="text-sm text-muted-foreground">{invoice.terms}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Bank details for wire transfer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Bank Name:</span>
                  <span className="text-sm">{invoice.paymentDetails.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Account Name:</span>
                  <span className="text-sm">{invoice.paymentDetails.accountName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Account Number:</span>
                  <span className="text-sm">{invoice.paymentDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">SWIFT/BIC:</span>
                  <span className="text-sm">{invoice.paymentDetails.swiftCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Routing Number:</span>
                  <span className="text-sm">{invoice.paymentDetails.routingNumber}</span>
                </div>
              </div>
              <Separator />
              <div className="rounded-lg bg-muted p-3 text-sm">
                <p className="font-medium mb-1">Payment Due By</p>
                <p className="text-muted-foreground">{invoice.dueDate}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Track payment progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Status:</span>
                  <InvoiceStatusBadge status={invoice.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Amount Due:</span>
                  <span className="text-sm font-bold">{invoice.balanceDue}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Payment Timeline</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-xs">Invoice Created: {invoice.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                    <span className="text-xs">Payment Due: {invoice.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    <span className="text-xs">Payment Received: Pending</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Related Items</CardTitle>
              <CardDescription>Connected bookings and tours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Booking</span>
                  <Badge variant="outline">BK-001</Badge>
                </div>
                <p className="text-sm">Bali Luxury Retreat</p>
                <p className="text-xs text-muted-foreground">Jun 15-22, 2025</p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Customer</span>
                  <Badge variant="outline">CUS-001</Badge>
                </div>
                <p className="text-sm">{invoice.customer.name}</p>
                <p className="text-xs text-muted-foreground">{invoice.customer.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
