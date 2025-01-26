import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function EventsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[170px]" />
      <Skeleton className="h-[170px]" />
      <Skeleton className="h-[170px]" />
    </div>
  );
}

export function TableRowsSkeleton({ columns }: { columns: number }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map((item) => (
        <TableRow key={item}>
          {Array.from({ length: columns }).map((_, i) => (
            <TableCell key={i}>
              <Skeleton className="h-[20px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
