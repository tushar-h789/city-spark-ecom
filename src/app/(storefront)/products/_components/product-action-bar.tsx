"use client";

import React, { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sortOptions = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest Arrivals" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "best-selling", label: "Best Selling" },
];

const filterCategories = [
  {
    id: "category",
    name: "Category",
    options: ["Boilers", "Radiators", "Heating Controls", "Valves"],
  },
  {
    id: "brand",
    name: "Brand",
    options: ["Worcester", "Vaillant", "Ideal", "Baxi", "Glow-worm"],
  },
  {
    id: "price",
    name: "Price Range",
    options: ["Under £100", "£100 - £500", "£500 - £1000", "Over £1000"],
  },
  {
    id: "availability",
    name: "Availability",
    options: ["In Stock", "Pre-order", "Out of Stock"],
  },
];

const ProductActionBar = () => {
  const [selectedSort, setSelectedSort] = useState("featured");
  const pathname = usePathname();
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  const includedRoutes = [
    "/products",
    "/products/c",
    "/brands",
    "/categories",
    "/search",
  ];

  const shouldShowActionBar = () => {
    return includedRoutes.some((route) => pathname.startsWith(route));
  };

  const handleFilterChange = (categoryId: string, option: string) => {
    setSelectedFilters((prev) => {
      const currentSelection = prev[categoryId] || [];
      const newSelection = currentSelection.includes(option)
        ? currentSelection.filter((item) => item !== option)
        : [...currentSelection, option];

      return {
        ...prev,
        [categoryId]: newSelection,
      };
    });
  };

  if (!shouldShowActionBar()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="h-14 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="h-full grid grid-cols-2 divide-x divide-gray-200">
          {/* Sort Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-center gap-2",
                  "active:bg-gray-50 transition-colors duration-200"
                )}
              >
                <ArrowUpDown className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Sort
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Sort Products</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <RadioGroup
                    value={selectedSort}
                    onValueChange={setSelectedSort}
                    className="gap-4"
                  >
                    {sortOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-3 px-4 py-2"
                      >
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id}>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="p-4">
                  <DrawerClose asChild>
                    <Button className="w-full">Apply Sort</Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Filter Drawer */}
          <Drawer>
            <DrawerTrigger asChild>
              <button
                className={cn(
                  "flex items-center justify-center gap-2",
                  "active:bg-gray-50 transition-colors duration-200"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                  Filter
                </span>
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Filter Products</DrawerTitle>
                </DrawerHeader>
                <div className="px-4">
                  <Accordion type="single" collapsible className="w-full">
                    {filterCategories.map((category) => (
                      <AccordionItem value={category.id} key={category.id}>
                        <AccordionTrigger>{category.name}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-4 py-3">
                            {category.options.map((option) => (
                              <div
                                key={option}
                                className="flex items-center gap-2"
                                onClick={() =>
                                  handleFilterChange(category.id, option)
                                }
                              >
                                <div
                                  className={cn(
                                    "w-5 h-5 border rounded-md flex items-center justify-center",
                                    selectedFilters[category.id]?.includes(
                                      option
                                    )
                                      ? "bg-primary border-primary"
                                      : "border-gray-300"
                                  )}
                                >
                                  {selectedFilters[category.id]?.includes(
                                    option
                                  ) && <Check className="h-4 w-4 text-white" />}
                                </div>
                                <span className="text-sm">{option}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <div className="p-4">
                  <DrawerClose asChild>
                    <Button className="w-full">Apply Filters</Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* Safe area padding for mobile browsers */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </div>
  );
};

export default ProductActionBar;
