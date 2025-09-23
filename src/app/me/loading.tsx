import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="flex min-h-screen flex-col bg-muted/20">
      <header className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </header>
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
        <Card>
          <CardHeader className="space-y-3">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
