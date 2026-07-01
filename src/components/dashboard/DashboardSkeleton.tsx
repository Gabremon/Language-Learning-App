import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 rounded-lg bg-brand-100" />
        <div className="h-4 w-64 rounded-lg bg-brand-50" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-8 w-8 rounded-full bg-brand-100" />
              <div className="mt-2 h-6 w-10 rounded bg-brand-100" />
              <div className="mt-1 h-3 w-8 rounded bg-brand-50" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="h-28 p-6">
          <div className="h-4 w-20 rounded bg-brand-100" />
          <div className="mt-3 h-6 w-40 rounded bg-brand-100" />
        </CardContent>
      </Card>
    </div>
  );
}
