import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthSegmentLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted to-background px-4 py-12">
      <Card className="w-full max-w-md border-none shadow-xl shadow-black/5">
        <CardHeader className="space-y-4">
          <Skeleton className="mx-auto h-4 w-24" />
          <Skeleton className="mx-auto h-4 w-48" />
          <Skeleton className="mx-auto h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4 py-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
