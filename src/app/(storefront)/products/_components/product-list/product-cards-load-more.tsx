"use client";

import { Prisma } from "@prisma/client";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductCard from "@/app/(storefront)/_components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, PackageX } from "lucide-react";

const ITEMS_PER_PAGE = 12;

type ProductCardsContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  isSearch?: boolean;
  search?: string;
};

type InventoryItemWithRelations = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        primaryCategory: true;
        secondaryCategory: true;
        tertiaryCategory: true;
        quaternaryCategory: true;
        brand: true;
      };
    };
  };
}>;

interface ProductCardsLoadMoreProps extends ProductCardsContainerProps {
  initialData: InventoryItemWithRelations[];
  initialTotalCount: number;
}

async function fetchInventoryProducts(
  page: number,
  queryParams: ProductCardsContainerProps
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: ITEMS_PER_PAGE.toString(),
    ...(queryParams.primaryCategoryId && {
      primaryCategoryId: queryParams.primaryCategoryId,
    }),
    ...(queryParams.secondaryCategoryId && {
      secondaryCategoryId: queryParams.secondaryCategoryId,
    }),
    ...(queryParams.tertiaryCategoryId && {
      tertiaryCategoryId: queryParams.tertiaryCategoryId,
    }),
    ...(queryParams.quaternaryCategoryId && {
      quaternaryCategoryId: queryParams.quaternaryCategoryId,
    }),
    ...(queryParams.isPrimaryRequired && {
      isPrimaryRequired: queryParams.isPrimaryRequired.toString(),
    }),
    ...(queryParams.isSecondaryRequired && {
      isSecondaryRequired: queryParams.isSecondaryRequired.toString(),
    }),
    ...(queryParams.isTertiaryRequired && {
      isTertiaryRequired: queryParams.isTertiaryRequired.toString(),
    }),
    ...(queryParams.isQuaternaryRequired && {
      isQuaternaryRequired: queryParams.isQuaternaryRequired.toString(),
    }),
    ...(queryParams.search && { search: queryParams.search }),
  });

  const response = await fetch(`/api/inventory?${params.toString()}`);
  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return {
    items: data.data,
    pagination: data.pagination,
  };
}

export default function ProductCardsLoadMore({
  initialData,
  initialTotalCount,
  ...queryParams
}: ProductCardsLoadMoreProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["products", queryParams],
      queryFn: async ({ pageParam }) => {
        return fetchInventoryProducts(pageParam, queryParams);
      },
      getNextPageParam: (lastPage) => {
        if (lastPage.pagination.hasMore) {
          return lastPage.pagination.page + 1;
        }
        return undefined;
      },
      initialPageParam: 2,
      initialData: {
        pages: [
          {
            items: initialData,
            pagination: {
              page: 1,
              limit: ITEMS_PER_PAGE,
              totalCount: initialTotalCount,
              totalPages: Math.ceil(initialTotalCount / ITEMS_PER_PAGE),
              hasMore: initialTotalCount > ITEMS_PER_PAGE,
            },
          },
        ],
        pageParams: [1],
      },
    });

  const allItems = [
    ...initialData,
    ...(data?.pages.slice(1).flatMap((page) => page.items) ?? []),
  ];

  const shouldShowLoadMore = initialTotalCount > ITEMS_PER_PAGE && hasNextPage;

  return (
    <div>
      {allItems.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allItems.map((item) => (
              <ProductCard key={item.id} inventoryItem={item} />
            ))}
          </div>

          {shouldShowLoadMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="h-11 px-8 font-medium bg-primary hover:bg-primary-hover active:bg-primary-active transition-colors duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
                size="lg"
              >
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <span>Load More Products</span>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="w-full h-64 flex items-center justify-center shadow-none border-0">
          <CardContent className="text-center">
            <PackageX className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-900">
              No products found
            </p>
            <p className="text-gray-600">
              Try adjusting your search or filter to find what you&apos;re
              looking for.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
