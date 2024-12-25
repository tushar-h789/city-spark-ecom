import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryGridSkeleton() {
  // Create an array of 9 elements to show a 3x3 grid of skeleton cards
  const skeletonCards = Array(9).fill(null);

  return (
    <div className="col-span-1 lg:col-span-9">
      {/* Title skeleton - only visible on mobile */}
      <Skeleton className="h-7 w-40 mb-4 lg:hidden" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-fr">
        {skeletonCards.map((_, index) => (
          <Card
            key={index}
            className="group h-full bg-white border-gray-300 rounded-xl overflow-hidden lg:shadow-md"
          >
            <div className="text-center p-3 pb-1 lg:p-6 lg:pb-2">
              {/* Title skeleton */}
              <Skeleton className="h-6 lg:h-8 w-3/4 mx-auto mb-2" />
              {/* Product count skeleton */}
              <Skeleton className="h-4 lg:h-5 w-1/2 mx-auto" />
            </div>
            <div className="p-2 lg:p-6">
              {/* Image skeleton */}
              <Skeleton className="h-20 lg:h-28 w-full" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
