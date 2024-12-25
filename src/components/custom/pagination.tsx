"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "next/navigation";
import useQueryString from "@/hooks/use-query-string";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  siblings?: number;
}

export function ReusablePagination({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  siblings = 2,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { createQueryString } = useQueryString();

  const navigateToPage = (page: number) => {
    router.push(`${pathname}?${createQueryString({ page: page.toString() })}`, {
      scroll: false,
    });
  };

  const renderPageLinks = () => {
    const pageLinks = [];

    pageLinks.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={currentPage === 1}
          onClick={() => navigateToPage(1)}
          className="cursor-pointer hover:bg-accent"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (totalPages > 7 && currentPage > 3) {
      pageLinks.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (
      let i = Math.max(2, currentPage - siblings);
      i <= Math.min(totalPages - 1, currentPage + siblings);
      i++
    ) {
      pageLinks.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => navigateToPage(i)}
            className="cursor-pointer hover:bg-accent"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (totalPages > 7 && currentPage < totalPages - 2) {
      pageLinks.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      pageLinks.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => navigateToPage(totalPages)}
            className="cursor-pointer hover:bg-accent"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pageLinks;
  };

  return (
    <div className="relative">
      <div className="text-xs text-muted-foreground absolute left-0 top-1/2 -translate-y-1/2">
        Showing{" "}
        <strong>
          {Math.min(
            itemsPerPage,
            totalCount - (currentPage - 1) * itemsPerPage
          )}
        </strong>{" "}
        of <strong>{totalCount}</strong> items
      </div>
      <Pagination className="mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => navigateToPage(Math.max(1, currentPage - 1))}
              className={cn(
                "cursor-pointer hover:bg-accent",
                currentPage === 1 && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>

          {renderPageLinks()}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                navigateToPage(Math.min(totalPages, currentPage + 1))
              }
              className={cn(
                "cursor-pointer hover:bg-accent",
                currentPage === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
