import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCardSkeleton from "../../products/_components/product-list/product-card-skeleton";

export default function ProductCarouselSkeleton() {
  return (
    <section className="container max-w-screen-xl mx-auto my-10 px-4 md:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full opacity-50"
            disabled
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full opacity-50"
            disabled
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Grid of product card skeletons */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>

      {/* Progress indicators skeleton - mobile only */}
      <div className="flex justify-center gap-1 mt-4 lg:hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-1.5 rounded-full ${i === 0 ? "w-6" : "w-1.5"}`}
          />
        ))}
      </div>
    </section>
  );
}
