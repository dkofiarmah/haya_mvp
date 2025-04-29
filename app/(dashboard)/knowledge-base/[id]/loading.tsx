import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DocumentDetailLoading() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-24 mt-1" />
              </div>
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>

            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-40" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-1" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-md border p-3">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
