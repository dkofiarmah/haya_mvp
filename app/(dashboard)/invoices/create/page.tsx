'use client'

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, Plus, Save, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CustomerSelector } from "@/components/customer-selector"

// This tells Next.js not to attempt prerendering this page
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export default function CreateInvoicePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="text-muted-foreground mt-1">Create a new invoice for a customer</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>Enter the basic details for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input id="invoice-number" value="INV-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(new Date(new Date().setDate(new Date().getDate() + 30)), "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-terms">Payment Terms</Label>
                  <Select defaultValue="net-30">
                    <SelectTrigger id="payment-terms">
                      <SelectValue placeholder="Select terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="due-receipt">Due on Receipt</SelectItem>
                      <SelectItem value="net-15">Net 15 Days</SelectItem>
                      <SelectItem value="net-30">Net 30 Days</SelectItem>
                      <SelectItem value="net-60">Net 60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Customer</Label>
                <Suspense fallback={<div>Loading customer selector...</div>}>
                  <CustomerSelector />
                </Suspense>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-reference">Booking Reference</Label>
                <Select>
                  <SelectTrigger id="booking-reference">
                    <SelectValue placeholder="Select booking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bk-001">BK-001: Bali Luxury Retreat (Jun 15-22, 2025)</SelectItem>
                    <SelectItem value="bk-002">BK-002: Japan Cultural Tour (Jul 10-17, 2025)</SelectItem>
                    <SelectItem value="none">No Booking Reference</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>Add the items to be included in this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-4 text-sm font-medium">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1"></div>
                </div>
                {[
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
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-12 items-center border-b p-4 last:border-0">
                    <div className="col-span-5">
                      <Input value={item.description} />
                    </div>
                    <div className="col-span-2">
                      <Input type="number" value={item.quantity} min="1" />
                    </div>
                    <div className="col-span-2">
                      <Input value={item.unitPrice} />
                    </div>
                    <div className="col-span-2">
                      <Input value={item.amount} readOnly className="bg-muted" />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>

              <div className="mt-4 space-y-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Subtotal</span>
                  <span className="font-medium">$10,350.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Tax (10%)</span>
                  <span className="font-medium">$1,035.00</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-xl font-bold">$11,385.00</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-sm font-medium">Amount Paid</span>
                  <Input className="w-40 text-right" value="$0.00" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold">Balance Due</span>
                  <span className="text-xl font-bold">$11,385.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Terms</CardTitle>
              <CardDescription>Add any additional notes or terms to the invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes for the customer..."
                  className="min-h-24"
                  defaultValue="Thank you for choosing our luxury tour services. We look forward to providing you with an unforgettable experience."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  placeholder="Add terms and conditions..."
                  className="min-h-24"
                  defaultValue="Payment is due within 30 days. Please make payment to the bank account details provided in the invoice. Cancellation policy applies as per our terms of service."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Configure additional invoice settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="invoice-currency">Currency</Label>
                <Select defaultValue="usd">
                  <SelectTrigger id="invoice-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="gbp">GBP (£)</SelectItem>
                    <SelectItem value="jpy">JPY (¥)</SelectItem>
                    <SelectItem value="aud">AUD (A$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-template">Template</Label>
                <Select defaultValue="luxury">
                  <SelectTrigger id="invoice-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-logo">Company Logo</Label>
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                  <Button variant="outline" size="sm">
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-color">Accent Color</Label>
                <div className="grid grid-cols-6 gap-2">
                  {["#000000", "#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"].map((color) => (
                    <div
                      key={color}
                      className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Options</CardTitle>
              <CardDescription>Configure payment methods for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="payment-methods">Accepted Payment Methods</Label>
                <div className="space-y-2">
                  {["Credit Card", "Bank Transfer", "PayPal"].map((method, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input type="checkbox" id={`method-${index}`} className="h-4 w-4" defaultChecked />
                      <Label htmlFor={`method-${index}`}>{method}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-details">Bank Details</Label>
                <Textarea
                  id="bank-details"
                  className="min-h-24"
                  defaultValue="Bank: Global Bank
Account Name: Luxury Tours Inc.
Account Number: 1234567890
SWIFT/BIC: GLBKUS12
Routing Number: 987654321"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
