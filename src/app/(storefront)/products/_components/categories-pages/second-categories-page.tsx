import React, { Suspense } from "react";
import { getCategoriesByType } from "../../actions";
import { Prisma } from "@prisma/client";
import StorefrontProductListPage from "../storefront-product-list-page";
import { CategoryWithChildParent } from "@/types/storefront-products";
import { cn } from "@/lib/utils";
import MobileCategoryNavCarousel from "../../../_components/mobile-category-nav-carousel";
import Image from "next/image";
import CategoryBanner from "@/images/category-banner.png";
import MobileBottomBar from "../../../_components/mobile-bottom-bar";
import DynamicCategorySidebar from "./dynamic-category-sidebar";
import CategorySidebarSkeleton from "./category-sidebar-skeleton";
import DynamicCategoryGrid from "./dynamic-category-grid";
import CategoryGridSkeleton from "./category-grid-skeleton";
import DynamicPageHeader from "./dynamic-category-page-header";
import PageHeaderSkeleton from "../product-list/page-header-skeleton";

type SecondaryCagoryWithChilds = Prisma.CategoryGetPayload<{
  include: {
    secondaryChildCategories: true;
    parentPrimaryCategory: true;
    secondaryProducts: true;
  };
}>;

export default async function SecondCategoriesPage({
  primaryId,
}: {
  primaryId?: string;
}) {
  const type = "SECONDARY";
  const { categories } = await getCategoriesByType(type, primaryId || "");
  const secondaryCategories = categories as SecondaryCagoryWithChilds[];

  // needed for the phone category nav carousel
  const { categories: mobileNavCategories } = await getCategoriesByType(
    "PRIMARY",
    ""
  );
  const navCategories = mobileNavCategories as CategoryWithChildParent[];

  if (secondaryCategories.length === 0) {
    return (
      <StorefrontProductListPage
        primaryCategoryId={primaryId}
        isPrimaryRequired
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Suspense fallback={<PageHeaderSkeleton />}>
        <DynamicPageHeader primaryCategoryId={primaryId} />
      </Suspense>

      <section className="mt-5 block lg:hidden">
        <MobileCategoryNavCarousel categories={navCategories} />
      </section>

      <section
        className={cn(
          "flex-grow mx-auto my-5 lg:my-10",
          "container max-w-screen-xl",
          "px-4 md:px-6 lg:px-8"
        )}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          <div className="hidden lg:block lg:col-span-3">
            <Suspense fallback={<CategorySidebarSkeleton />}>
              <DynamicCategorySidebar primaryCategoryId={primaryId} />
            </Suspense>
          </div>

          <div className="col-span-1 lg:col-span-9">
            <section>
              <Image
                src={CategoryBanner}
                alt="Category Banner"
                className="rounded-lg"
                placeholder="blur"
              />
            </section>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-fr mt-5">
              <Suspense fallback={<CategoryGridSkeleton />}>
                <DynamicCategoryGrid primaryId={primaryId} />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      <MobileBottomBar isShowInProductPage />
    </main>
  );
}
