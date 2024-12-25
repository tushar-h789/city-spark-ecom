"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryNavSkeleton() {
  const pathname = usePathname();
  const excludedRoutes = [
    "/login",
    "/register",
    "/cart",
    "/checkout",
    "/basket",
  ];

  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  return (
    <div className="relative bg-white border-b hidden lg:block">
      <div className="container mx-auto max-w-screen-xl px-0">
        <div className="flex w-full">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="flex-1 relative border-r last:border-r-0 border-gray-100"
            >
              <div
                className={cn(
                  "flex flex-col items-center p-3 w-full",
                  "relative overflow-hidden"
                )}
              >
                <div className="relative flex flex-col items-center w-full">
                  <Skeleton className="w-[26px] h-[26px] rounded-md" />
                  <Skeleton className="w-16 h-4 mt-2 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
