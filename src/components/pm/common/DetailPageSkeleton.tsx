import { Skeleton } from "@/components/ui/skeleton";

export function DetailPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <div className="space-y-4">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-4 rounded-full" />
            <Skeleton className="h-6 w-[250px]" />
          </div>
          <Skeleton className="h-4 w-[500px]" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="">
          <Skeleton className="h-40 " />
        </div>
        <div className="">
          <Skeleton className="h-40 " />
        </div>
      </div>
    </div>
  );
}
