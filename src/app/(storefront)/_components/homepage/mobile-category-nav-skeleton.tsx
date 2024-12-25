import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function MobileCategoryNavSkeleton() {
  return (
    <div className="lg:hidden mt-5">
      <div className="px-4 mb-4 flex items-center justify-between">
        {/* Title skeleton */}
        <Skeleton className="h-7 w-24" />
        {/* Link skeleton */}
        <Skeleton className="h-5 w-20" />
      </div>

      {/* Carousel skeleton */}
      <div className="pl-4 overflow-hidden">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex-none w-[31%] min-w-[110px] pr-3">
              <div
                className={cn(
                  "flex flex-col items-center p-4 w-full",
                  "rounded-xl border border-border",
                  "bg-white"
                )}
              >
                {/* Icon skeleton */}
                <Skeleton className="w-8 h-8 rounded-full" />
                {/* Text skeleton */}
                <Skeleton className="w-16 h-4 mt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
