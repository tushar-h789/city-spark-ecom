import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductCardsContainerSkeletonProps {
  count?: number;
}

export default function ProductCardsContainerSkeleton({
  count = 12,
}: ProductCardsContainerSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Title and count skeletons - mobile only */}
      <div className="lg:hidden space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Banner skeleton */}
      <Skeleton className="w-full aspect-[3/1] rounded-lg" />

      {/* Header section */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Skeleton className="h-5 w-48 hidden lg:block" />
        <Skeleton className="h-10 w-[180px] hidden lg:block" />
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(count)].map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
