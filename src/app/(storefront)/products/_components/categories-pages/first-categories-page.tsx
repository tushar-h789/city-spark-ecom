import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import MobileBottomBar from "../../../_components/mobile-bottom-bar";
import CategoryGrid from "./dynamic-category-grid";
import CategorySidebarSkeleton from "./category-sidebar-skeleton";
import CategoryGridSkeleton from "./category-grid-skeleton";
import DynamicCategorySidebar from "./dynamic-category-sidebar";
import DynamicPageHeader from "./dynamic-category-page-header";
import PageHeaderSkeleton from "../product-list/page-header-skeleton";

export default function FirstCategoriesPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<PageHeaderSkeleton />}>
        <DynamicPageHeader />
      </Suspense>

      <section
        className={cn(
          "flex-grow mx-auto my-5 lg:my-10",
          "container max-w-screen-xl",
          "px-4 md:px-6 lg:px-8"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          <Suspense fallback={<CategorySidebarSkeleton />}>
            <DynamicCategorySidebar />
          </Suspense>

          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGrid />
          </Suspense>
        </div>
      </section>

      <MobileBottomBar isShowInProductPage />
    </main>
  );
}
