import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <Card className="shadow-none lg:shadow-md group h-full flex flex-col bg-white border-gray-300 rounded-xl overflow-hidden lg:hover:shadow-lg transition-all duration-300">
      {/* Product image skeleton */}
      <div className="relative">
        <Skeleton className="h-32 sm:h-48 md:h-56 lg:h-64 w-full" />
      </div>

      {/* Content section */}
      <div className="p-2 sm:p-4 space-y-3">
        {/* Brand/Category */}
        <Skeleton className="h-4 w-24 hidden sm:block" />

        {/* Rating */}
        <Skeleton className="h-4 w-28" />

        {/* Title */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-8 w-full" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCardSkeleton;
