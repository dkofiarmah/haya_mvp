import { Badge } from "@/components/ui/badge"

type InvoiceStatus = "draft" | "pending" | "paid" | "overdue"

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const statusConfig = {
    draft: {
      label: "Draft",
      variant: "outline" as const,
    },
    pending: {
      label: "Pending",
      variant: "secondary" as const,
    },
    paid: {
      label: "Paid",
      variant: "default" as const,
    },
    overdue: {
      label: "Overdue",
      variant: "destructive" as const,
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className="font-normal">
      {config.label}
    </Badge>
  )
}
