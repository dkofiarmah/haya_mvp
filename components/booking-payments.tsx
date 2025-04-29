import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Plus } from "lucide-react"

interface Payment {
  id: string
  date: string
  amount: string
  type: string
  status: string
  method: string
}

interface BookingPaymentsProps {
  payments: Payment[]
}

export function BookingPayments({ payments }: BookingPaymentsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Track payments and invoices</CardDescription>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-6 border-b bg-muted/50 p-4 text-sm font-medium">
            <div className="col-span-1">Payment ID</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Method</div>
          </div>
          {payments.map((payment) => (
            <div key={payment.id} className="grid grid-cols-6 items-center border-b p-4 last:border-0">
              <div className="col-span-1 font-medium">{payment.id}</div>
              <div className="col-span-1">{payment.date}</div>
              <div className="col-span-1 font-medium">{payment.amount}</div>
              <div className="col-span-1">{payment.type}</div>
              <div className="col-span-1">
                <Badge
                  variant="outline"
                  className={
                    payment.status === "Paid"
                      ? "bg-green-500/10 text-green-500"
                      : payment.status === "Pending"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-red-500/10 text-red-500"
                  }
                >
                  {payment.status}
                </Badge>
              </div>
              <div className="col-span-1 flex items-center justify-between">
                <span>{payment.method}</span>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
