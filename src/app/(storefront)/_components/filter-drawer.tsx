"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const FilterDrawer = () => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Example data - replace with your actual data
  const categories = [
    { id: "1", label: "Boilers" },
    { id: "2", label: "Radiators" },
    { id: "3", label: "Heating" },
  ];

  const brands = [
    { id: "1", label: "Worcester" },
    { id: "2", label: "Vaillant" },
    { id: "3", label: "Ideal" },
  ];

  const handleClear = () => {
    setPriceRange({ min: "", max: "" });
    setSelectedCategories([]);
    setSelectedBrands([]);
  };

  const handleApply = () => {
    // Apply filters logic here
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-primary/10 rounded-full"
        >
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <DrawerTitle className="font-bold text-lg">Filters</DrawerTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <ScrollArea className="h-[50vh] px-4">
            <div className="py-6 space-y-8">
              {/* Price Range */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Price Range</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="w-24"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="w-24"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Categories</Label>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={(checked) => {
                          setSelectedCategories(
                            checked
                              ? [...selectedCategories, category.id]
                              : selectedCategories.filter(
                                  (id) => id !== category.id
                                )
                          );
                        }}
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-4">
                <Label className="text-base font-medium">Brands</Label>
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand.id}`}
                        checked={selectedBrands.includes(brand.id)}
                        onCheckedChange={(checked) => {
                          setSelectedBrands(
                            checked
                              ? [...selectedBrands, brand.id]
                              : selectedBrands.filter((id) => id !== brand.id)
                          );
                        }}
                      />
                      <label
                        htmlFor={`brand-${brand.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DrawerFooter className="border-t bg-white pt-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClear}
              >
                Clear All
              </Button>
              <Button className="flex-1" onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDrawer;
