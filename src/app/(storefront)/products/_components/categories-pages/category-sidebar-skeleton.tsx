import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function CategorySidebarSkeleton() {
  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-20">
        <Card className="border-gray-300 rounded-xl overflow-hidden hover:shadow-sm transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse" />
          </CardHeader>
          <Separator />
          <CardContent className="pb-0 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Generate 6 skeleton items */}
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-2 w-full">
                    <div
                      className={cn(
                        "h-5 bg-gray-200 rounded-md animate-pulse",
                        // Vary the widths for more realistic appearance
                        index % 2 === 0 ? "w-3/4" : "w-2/3"
                      )}
                    />
                  </div>
                </div>
                {/* Add subcategories for even-numbered items */}
                {index % 2 === 0 && (
                  <div className="pl-3 space-y-3 pb-2">
                    {[...Array(3)].map((_, subIndex) => (
                      <div
                        key={subIndex}
                        className="h-4 bg-gray-200 rounded-md animate-pulse w-4/5"
                      />
                    ))}
                  </div>
                )}
                {index < 5 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
