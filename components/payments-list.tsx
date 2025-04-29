import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function PaymentsList() {
  const payments = [
    {
      id: "INV-001",
      customer: "John Davis",
      tour: "Bali Luxury Retreat",
      amount: "$4,850.00",
      status: "Completed",
      date: "Jun 12, 2025",
      paymentMethod: "Credit Card",
    },
    {
      id: "INV-002",
      customer: "Emma Thompson",
      tour: "Paris Getaway",
      amount: "$6,200.00",
      status: "Pending",
      date: "Jun 15, 2025",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "INV-003",
      customer: "Michael Chen",
      tour: "Tokyo Adventure",
      amount: "$5,400.00",
      status: "Completed",
      date: "Jun 18, 2025",
      paymentMethod: "Credit Card",
    },
    {
      id: "INV-004",
      customer: "Sarah Johnson",
      tour: "African Safari",
      amount: "$7,500.00",
      status: "Refunded",
      date: "Jun 20, 2025",
      paymentMethod: "Credit Card",
    },
    {
      id: "INV-005",
      customer: "Robert Miller",
      tour: "European Heritage Tour",
      amount: "$6,200.00",
      status: "Completed",
      date: "Jun 22, 2025",
      paymentMethod: "PayPal",
    },
  ]

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
        <div className="col-span-2">Invoice ID</div>
        <div className="col-span-2">Customer</div>
        <div className="col-span-2">Tour</div>
        <div className="col-span-2">Amount</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-1">Method</div>
        <div className="col-span-1"></div>
      </div>
      {payments.map((payment) => (
        <div key={payment.id} className="grid grid-cols-12 items-center border-b p-4 last:border-0">
          <div className="col-span-2 font-medium">{payment.id}</div>
          <div className="col-span-2 text-sm">{payment.customer}</div>
          <div className="col-span-2 text-sm">{payment.tour}</div>
          <div className="col-span-2 text-sm font-medium">{payment.amount}</div>
          <div className="col-span-1">
            {payment.status === "Completed" ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                Completed
              </Badge>
            ) : payment.status === "Pending" ? (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                Pending
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                Refunded
              </Badge>
            )}
          </div>
          <div className="col-span-1 text-sm text-muted-foreground">{payment.date}</div>
          <div className="col-span-1 text-sm text-muted-foreground">{payment.paymentMethod}</div>
          <div className="col-span-1 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Invoice</DropdownMenuItem>
                <DropdownMenuItem>Download PDF</DropdownMenuItem>
                <DropdownMenuItem>Send to Customer</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">Void Invoice</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  )
}
