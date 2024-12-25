"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { Loader2, Package2 } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { fetchProducts, FetchProductsParams } from "@/services/admin-products";
import SwipeableProductCard from "./swipeable-product-card";
import { Button } from "@/components/ui/button";

interface MobileProductListProps {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
}

export default function MobileProductList({
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
  quaternaryCategoryId,
}: MobileProductListProps) {
  const searchParams = useSearchParams();
  const observerTarget = useRef<HTMLDivElement>(null);

  const currentParams: Omit<FetchProductsParams, "page"> = {
    page_size: "10",
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "updatedAt",
    sort_order:
      (searchParams.get("sort_order") as FetchProductsParams["sort_order"]) ||
      "desc",
    filter_status: searchParams.get("filter_status") || "",
    // Add category filters if they exist - using snake_case
    ...(primaryCategoryId && { primary_category_id: primaryCategoryId }),
    ...(secondaryCategoryId && { secondary_category_id: secondaryCategoryId }),
    ...(tertiaryCategoryId && { tertiary_category_id: tertiaryCategoryId }),
    ...(quaternaryCategoryId && {
      quaternary_category_id: quaternaryCategoryId,
    }),
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", currentParams],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchProducts({
        ...currentParams,
        page: pageParam.toString(),
      });
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.5,
    });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [handleObserver]);

  if (isLoading) {
    return (
      <div className="flex lg:hidden items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex lg:hidden flex-col items-center justify-center min-h-[400px] text-gray-500">
        <p className="text-red-500 mb-4">Error loading products</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!data || !data.pages[0].products.length) {
    return (
      <div className="flex lg:hidden flex-col items-center justify-center min-h-[400px] text-gray-500">
        <Package2 className="h-12 w-12 mb-4" />
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div className="grid lg:hidden gap-2 pb-[72px]">
      {data.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.products.map((product) => (
            <SwipeableProductCard key={product.id} product={product} />
          ))}
        </React.Fragment>
      ))}
      <div ref={observerTarget} className="flex justify-center py-6 mb-6">
        {isFetchingNextPage ? (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        ) : hasNextPage ? (
          <span className="text-sm text-muted-foreground">Loading more...</span>
        ) : (
          <span className="text-sm text-muted-foreground">
            No more products
          </span>
        )}
      </div>
    </div>
  );
}
