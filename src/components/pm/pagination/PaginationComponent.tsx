"use client";

import { useSearchParams, usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  limit?: number;
  offset?: number;
  totalResults?: number;
}

export default function PaginationComponent({
  limit = 10,
  totalResults = 0,
}: PaginationComponentProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const numPages = Array.from(
    { length: Math.ceil(totalResults / limit) },
    (_, i) => i + 1
  );

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < numPages.length;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious href={buildHref(currentPage - 1)} />
          </PaginationItem>
        )}
        {numPages.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href={buildHref(pageNum)}
              isActive={pageNum === currentPage}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}
        {/* {numPages.length > 5 && <PaginationEllipsis />} */}
        {hasNextPage && (
          <PaginationItem>
            <PaginationNext href={buildHref(currentPage + 1)} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
