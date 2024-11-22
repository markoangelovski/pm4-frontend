import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import React from "react";

const TableSkeleton = ({
  rows = 10,
  columns = 4
}: {
  rows?: number;
  columns?: number;
}) => {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: columns }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton className="h-5 w-auto" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default TableSkeleton;
