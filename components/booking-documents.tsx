import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Plus, Upload } from "lucide-react"

export function BookingDocuments() {
  const documents = [
    {
      id: "DOC-001",
      name: "Booking Confirmation",
      type: "PDF",
      size: "245 KB",
      date: "Jan 15, 2025",
      status: "Sent to Customer",
    },
    {
      id: "DOC-002",
      name: "Invoice #INV-001",
      type: "PDF",
      size: "180 KB",
      date: "Jan 15, 2025",
      status: "Paid",
    },
    {
      id: "DOC-003",
      name: "Travel Itinerary",
      type: "PDF",
      size: "320 KB",
      date: "Jan 20, 2025",
      status: "Sent to Customer",
    },
    {
      id: "DOC-004",
      name: "Passport Copies",
      type: "PDF",
      size: "1.2 MB",
      date: "Jan 25, 2025",
      status: "Received",
    },
    {
      id: "DOC-005",
      name: "Travel Insurance",
      type: "PDF",
      size: "540 KB",
      date: "Feb 10, 2025",
      status: "Pending",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Booking Documents</CardTitle>
          <CardDescription>Manage documents related to this booking</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Document
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-6 border-b bg-muted/50 p-4 text-sm font-medium">
            <div className="col-span-2">Document</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Size</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Status</div>
          </div>
          {documents.map((doc) => (
            <div key={doc.id} className="grid grid-cols-6 items-center border-b p-4 last:border-0">
              <div className="col-span-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{doc.name}</span>
              </div>
              <div className="col-span-1">{doc.type}</div>
              <div className="col-span-1">{doc.size}</div>
              <div className="col-span-1">{doc.date}</div>
              <div className="col-span-1 flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={
                    doc.status === "Sent to Customer"
                      ? "bg-blue-500/10 text-blue-500"
                      : doc.status === "Paid"
                        ? "bg-green-500/10 text-green-500"
                        : doc.status === "Received"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-amber-500/10 text-amber-500"
                  }
                >
                  {doc.status}
                </Badge>
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
