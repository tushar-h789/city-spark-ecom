"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { DualRangeSlider } from "@/components/ui/dual-range-slider";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type FilterBrand = {
  id: string;
  name: string;
  count: number;
};

type BrandsResponse = {
  data: FilterBrand[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
};

type FilterOption = {
  id: string;
  name: string;
  options: string[];
};

interface SeeMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

const SeeMoreButton: React.FC<SeeMoreButtonProps> = ({
  onClick,
  isLoading,
  disabled,
}) => (
  <div className="flex items-center mt-5">
    <button
      className="text-sm text-gray-600 hover:underline"
      onClick={onClick}
      disabled={disabled}
    >
      See More
    </button>
    {isLoading && (
      <div className="ml-2">
        <Loader2 className="animate-spin text-gray-400" size={18} />
      </div>
    )}
  </div>
);

async function fetchBrands({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: [string, string];
}): Promise<BrandsResponse> {
  const [_, search] = queryKey;
  const response = await axios.get("/api/brands", {
    params: { search, limit: 5, page: pageParam },
  });
  return response.data;
}

export default function FilterSidebar({
  initialBrands,
  filterOptions,
}: {
  initialBrands: FilterBrand[];
  filterOptions: FilterOption[];
}) {
  const [brandSearch, setBrandSearch] = useState("");
  const [isBrandsExpanded, setIsBrandsExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({});
  const [isClientBrands, setIsClientBrands] = useState(false);
  const [priceRange, setPriceRange] = useState([99, 546]);
  const debouncedBrandSearch = useDebounce(brandSearch, 300);
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["brands", debouncedBrandSearch] as const,
    queryFn: ({ pageParam = 1 }) =>
      fetchBrands({ pageParam, queryKey: ["brands", debouncedBrandSearch] }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.page + 1 : undefined,
    enabled: isClientBrands || !!debouncedBrandSearch,
  });

  const toggleFilter = (filterId: string) => {
    setExpandedFilters((prev) => ({ ...prev, [filterId]: !prev[filterId] }));
  };

  const handleSeeMore = async () => {
    if (!isClientBrands) {
      setIsClientBrands(true);
      await queryClient.prefetchInfiniteQuery({
        queryKey: ["brands", debouncedBrandSearch] as const,
        queryFn: ({ pageParam = 1 }) =>
          fetchBrands({
            pageParam,
            queryKey: ["brands", debouncedBrandSearch],
          }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
          lastPage.pagination.hasMore
            ? lastPage.pagination.page + 1
            : undefined,
        pages: 2,
      });
      refetch();
    } else {
      fetchNextPage();
    }
  };

  const allBrands = data?.pages.flatMap((page) => page.data) || initialBrands;

  return (
    <aside className="w-full max-w-xs flex flex-col gap-6">
      {/* Header - Improved clarity and alignment */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">Filter Products</h4>
        <button className="text-sm text-primary hover:text-primary/90 font-medium transition-colors">
          Reset All
        </button>
      </div>

      <Card className="border-gray-300 overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="divide-y divide-gray-200">
          {/* Brands Section */}
          <div className="p-5">
            <button
              className="w-full flex justify-between items-center group"
              onClick={() => setIsBrandsExpanded(!isBrandsExpanded)}
            >
              <span className="font-semibold text-gray-900">Brands</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-all duration-200 ${
                  isBrandsExpanded ? "rotate-180" : ""
                } group-hover:text-primary`}
              />
            </button>

            <div
              className={`grid transition-all duration-200 ${
                isBrandsExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 mt-5">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                      size={16}
                    />
                    <Input
                      placeholder="Search brands"
                      value={brandSearch}
                      onChange={(e) => {
                        setBrandSearch(e.target.value);
                        setIsClientBrands(true);
                      }}
                      className={`pl-9 h-10 bg-white border-gray-300 hover:border-secondary transition-colors
                  focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary
                  ${isFetching ? "pr-9" : ""}`}
                    />
                    {isFetching && !isFetchingNextPage && (
                      <Loader2
                        className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-secondary"
                        size={16}
                      />
                    )}
                  </div>

                  <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                    {allBrands.map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center group/item hover:bg-secondary/5 rounded-md transition-colors p-1.5"
                      >
                        <Checkbox
                          id={brand.id}
                          className="h-4 w-4 rounded border-gray-300 text-secondary 
                      focus:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                        />
                        <label
                          htmlFor={brand.id}
                          className="ml-3 text-sm text-gray-700 flex-1 flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate group-hover/item:text-gray-900">
                            {brand.name}
                          </span>
                          <span className="text-gray-400 text-xs">
                            ({brand.count})
                          </span>
                        </label>
                      </div>
                    ))}

                    {!isFetching &&
                      !isFetchingNextPage &&
                      allBrands.length === 0 && (
                        <p className="text-sm text-gray-500 py-2 text-center">
                          No brands found
                        </p>
                      )}
                  </div>

                  {(!isClientBrands || hasNextPage) && (
                    <button
                      onClick={handleSeeMore}
                      disabled={isFetchingNextPage}
                      className="w-full text-sm font-medium text-secondary hover:text-secondary/90 
                  disabled:opacity-50 flex items-center justify-center gap-2 py-2 
                  transition-colors border-t border-gray-100"
                    >
                      {isFetchingNextPage ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Show More"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Options with matching style */}
          {filterOptions.map((option) => (
            <div key={option.id} className="p-5">
              <button
                className="w-full flex justify-between items-center group"
                onClick={() => toggleFilter(option.id)}
              >
                <span className="font-semibold text-gray-900 capitalize">
                  {option.name}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-all duration-200 ${
                    expandedFilters[option.id] ? "rotate-180" : ""
                  } group-hover:text-primary`}
                />
              </button>

              <div
                className={`grid transition-all duration-200 ${
                  expandedFilters[option.id]
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1.5 mt-5">
                    {option.options.map((value) => (
                      <div
                        key={value}
                        className="flex items-center hover:bg-secondary/5 rounded-md transition-colors p-1.5"
                      >
                        <Checkbox
                          id={`${option.id}-${value}`}
                          className="h-4 w-4 rounded border-gray-300 text-secondary 
                      focus:ring-secondary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                        />
                        <label
                          htmlFor={`${option.id}-${value}`}
                          className="ml-3 text-sm text-gray-700 hover:text-gray-900 cursor-pointer"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Price Range matching product card style */}
          <div className="p-5">
            <button
              className="w-full flex justify-between items-center group"
              onClick={() => setIsPriceExpanded(!isPriceExpanded)}
            >
              <span className="font-semibold text-gray-900">Price Range</span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-all duration-200 ${
                  isPriceExpanded ? "rotate-180" : ""
                } group-hover:text-primary`}
              />
            </button>

            <div
              className={`grid transition-all duration-200 ${
                isPriceExpanded
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-4 mt-5">
                  <DualRangeSlider
                    min={0}
                    max={1000}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-full"
                  />

                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value), priceRange[1]])
                      }
                      className="h-10 bg-white border-gray-300 hover:border-secondary transition-colors
                  focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary"
                      placeholder="£ Min"
                    />
                    <span className="text-gray-400">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value)])
                      }
                      className="h-10 bg-white border-gray-300 hover:border-secondary transition-colors
                  focus-visible:ring-1 focus-visible:ring-secondary/20 focus-visible:border-secondary"
                      placeholder="£ Max"
                    />
                  </div>

                  <Button className="w-full bg-secondary hover:bg-secondary/90 transition-colors">
                    Apply Filter
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
}
