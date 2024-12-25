"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function FilterSidebarSkeleton() {
  return (
    <aside className="w-full max-w-xs flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>

      <Card className="border-gray-300">
        <div className="divide-y divide-gray-200">
          {/* Brands Section */}
          <div className="p-5">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-5" />
            </div>

            <div className="space-y-4 mt-5">
              {/* Search Input */}
              <Skeleton className="h-10 w-full" />

              {/* Brand Items */}
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                ))}
              </div>

              {/* See More Button */}
              <Skeleton className="h-8 w-full" />
            </div>
          </div>

          {/* Filter Options */}
          {[1, 2, 3].map((section) => (
            <div key={section} className="p-5">
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-5" />
              </div>

              <div className="space-y-2 mt-5">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Price Range Section */}
          <div className="p-5">
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-5" />
            </div>

            <div className="space-y-4 mt-5">
              {/* Range Slider */}
              <Skeleton className="h-2 w-full" />

              {/* Price Inputs */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 flex-1" />
                <span className="text-gray-400">-</span>
                <Skeleton className="h-10 flex-1" />
              </div>

              {/* Apply Button */}
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </Card>
    </aside>
  );
}
