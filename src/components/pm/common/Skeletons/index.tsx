import { Skeleton } from "@/components/ui/skeleton";

export function EventsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[170px]" />
      <Skeleton className="h-[170px]" />
      <Skeleton className="h-[170px]" />
    </div>
  );
}
