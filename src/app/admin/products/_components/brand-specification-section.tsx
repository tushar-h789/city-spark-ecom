"use client";

import { useEffect, useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { fetchBrands } from "@/services/admin-brands";
import { ProductFormInputType } from "../schema";
import { useDebounce } from "@/hooks/use-debounce";
import { CommandLoading } from "cmdk";
import Image from "next/image";
import { Brand } from "@prisma/client";

type Props = {
  productDetails?: {
    brand?: Brand | null;
  } | null;
};

export default function BrandSpecificationsSection({ productDetails }: Props) {
  const [openBrands, setOpenBrands] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { control, watch } = useFormContext<ProductFormInputType>();
  const selectedBrandId = watch("brand");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["brands", debouncedSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchBrands({
        sort_by: "name",
        sort_order: "asc",
        filter_status: "ACTIVE",
        page: String(pageParam),
        page_size: "10",
        search: debouncedSearch,
      });
      return response;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
    },
  });

  // Memoize the flattened brands array
  const brands = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data?.pages]);

  // Find the selected brand, including the initial product details
  const selectedBrand = useMemo(() => {
    if (!selectedBrandId) return null;

    return (
      brands.find((brand) => brand.id === selectedBrandId) ||
      (productDetails?.brand?.id === selectedBrandId
        ? productDetails.brand
        : null)
    );
  }, [selectedBrandId, brands, productDetails]);

  // Load more pages until we find the selected brand
  useEffect(() => {
    const findSelectedBrand = async () => {
      if (!selectedBrandId || !openBrands) return;
      if (brands.some((brand) => brand.id === selectedBrandId)) return;

      if (hasNextPage) {
        await fetchNextPage();
      }
    };

    findSelectedBrand();
  }, [selectedBrandId, brands, hasNextPage, fetchNextPage, openBrands]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Brand Specifications</CardTitle>
        <CardDescription>
          Please provide the brand specifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="grid gap-3">
              <FormField
                control={control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Popover open={openBrands} onOpenChange={setOpenBrands}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            disabled={isLoading}
                            aria-expanded={openBrands}
                            className="w-full justify-between"
                          >
                            {isLoading ? (
                              "Loading..."
                            ) : selectedBrand ? (
                              <div className="flex items-center gap-2">
                                <div className="relative h-5 w-5 rounded overflow-hidden flex-shrink-0 flex items-center">
                                  {selectedBrand.image && (
                                    <Image
                                      src={selectedBrand.image}
                                      alt={selectedBrand.name}
                                      width={50}
                                      height={50}
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <span className="truncate">
                                  {selectedBrand.name}
                                </span>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">
                                Select a brand
                              </p>
                            )}
                            {isLoading ? (
                              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            ) : (
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command shouldFilter={false}>
                            <CommandInput
                              placeholder="Search brands..."
                              value={search}
                              onValueChange={setSearch}
                            />
                            <CommandList>
                              <CommandEmpty>No brands found.</CommandEmpty>
                              {isPending ? (
                                <CommandLoading>
                                  Loading brands...
                                </CommandLoading>
                              ) : (
                                <CommandGroup>
                                  {brands?.map((brand) => (
                                    <CommandItem
                                      key={brand.id}
                                      value={brand.name}
                                      onSelect={() => {
                                        field.onChange(brand.id);
                                        setOpenBrands(false);
                                      }}
                                      className="flex items-center gap-2"
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          field.value === brand.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="relative h-5 w-5 rounded overflow-hidden flex-shrink-0 flex items-center">
                                        {brand.image && (
                                          <Image
                                            src={brand.image}
                                            alt={brand.name}
                                            width={50}
                                            height={50}
                                            className="object-cover"
                                          />
                                        )}
                                      </div>
                                      <span className="truncate">
                                        {brand.name}
                                      </span>
                                    </CommandItem>
                                  ))}
                                  {hasNextPage && (
                                    <Button
                                      variant="ghost"
                                      className="w-full"
                                      onClick={() => fetchNextPage()}
                                      disabled={isFetchingNextPage}
                                    >
                                      {isFetchingNextPage ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      ) : (
                                        "Load more"
                                      )}
                                    </Button>
                                  )}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={control}
                name="productCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={control}
                name="warranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Warranty</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter warranty in months"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3">
              <FormField
                control={control}
                name="guarantee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guarantee</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter guarantee in months"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="grid gap-3">
            <FormField
              control={control}
              name="manufacturerLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer Website Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter manufacturer website URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
