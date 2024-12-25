import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageHeaderSkeleton() {
  const items = Array.from({ length: 3 });

  return (
    <section className="hidden lg:block bg-primary py-8">
      <div className="container mx-auto max-w-screen-xl">
        <Breadcrumb>
          <BreadcrumbList>
            {/* Home item skeleton */}
            <div className="flex items-center">
              <div className="h-4 w-4 rounded bg-white/30 animate-pulse" />
              <div className="ml-1 h-4 w-16 rounded bg-white/30 animate-pulse" />
            </div>

            {items.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className="mx-2 text-white/70">/</div>
                <div
                  className={`h-4 rounded animate-pulse ${
                    index === items.length - 1
                      ? "w-24 bg-secondary/80" // More visible secondary color
                      : "w-20 bg-white/30" // Semi-transparent white for better contrast
                  }`}
                />
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {/* Title skeleton with improved contrast */}
        <Skeleton className="h-10 w-64 bg-white/40 rounded animate-pulse mt-4" />
      </div>
    </section>
  );
}
