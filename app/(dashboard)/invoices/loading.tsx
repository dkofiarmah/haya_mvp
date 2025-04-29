import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function InvoicesLoading() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-7 w-20 mb-1" />
                <Skeleton className="h-4 w-32" />
                <div className="mt-4">
                  <Skeleton className="h-2 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-xs" />
        <Card>
          <CardHeader className="p-4">
            <div className="grid grid-cols-12">
              <Skeleton className="col-span-4 h-4 w-24" />
              <Skeleton className="col-span-2 h-4 w-16" />
              <Skeleton className="col-span-2 h-4 w-16" />
              <Skeleton className="col-span-2 h-4 w-16" />
              <Skeleton className="col-span-2 h-4 w-16" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {Array(5)
              .fill(null)
              .map((_, i) => (
                <div key={i} className="grid grid-cols-12 items-center border-b p-4 last:border-0">
                  <div className="col-span-4 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="col-span-2 h-4 w-16" />
                  <Skeleton className="col-span-2 h-4 w-16" />
                  <Skeleton className="col-span-2 h-4 w-20" />
                  <Skeleton className="col-span-2 h-6 w-16" />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
