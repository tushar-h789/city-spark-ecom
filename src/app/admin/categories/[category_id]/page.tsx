"use client";

import React, { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CategoryForm from "../_components/category-form";
import ProductsLoading from "../../products/_components/products-loading";
import MobileProductList from "../../products/_components/mobile-product-list";
import DesktopProductList from "../../products/_components/desktop-product-list";
import { Loader2 } from "lucide-react";
import { fetchCategory } from "@/services/admin-categories";

type PageParams = Promise<{
  category_id: string;
}>;

type SearchParams = Promise<{
  category_type?: string;
  parent_primary_id?: string;
  parent_secondary_id?: string;
}>;

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

export default function AdminEditCategoryPage(props: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  const params = React.use(props.params);

  const {
    data: response,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["category", params],
    queryFn: async () => {
      return fetchCategory(params.category_id);
    },
  });

  const getLoadingOrErrorContent = (
    state: "loading" | "error"
  ): React.ReactElement => {
    const breadcrumbItems: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/admin" },
      { label: "Categories", href: "/admin/categories" },
      {
        label: state === "loading" ? "Loading..." : "Error",
        isCurrentPage: true,
      },
    ];

    return (
      <ContentLayout title={state === "loading" ? "Loading..." : "Error"}>
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center h-[400px]">
          {state === "loading" ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <div className="text-destructive">
              Error loading category. Please try again.
            </div>
          )}
        </div>
      </ContentLayout>
    );
  };

  if (isPending) {
    return getLoadingOrErrorContent("loading");
  }

  if (isError) {
    return getLoadingOrErrorContent("error");
  }

  const categoryDetails = response.data;

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/admin" },
    { label: "Categories", href: "/admin/categories" },
    {
      label: `Edit ${categoryDetails.name}`,
      href: `/admin/categories/${categoryDetails.name}`,
      isCurrentPage: true,
    },
  ];

  // Determine category IDs based on category type
  const categoryIds = {
    primaryCategoryId:
      categoryDetails.type === "PRIMARY"
        ? categoryDetails.id
        : categoryDetails.parentPrimaryCategoryId || undefined,
    secondaryCategoryId:
      categoryDetails.type === "SECONDARY"
        ? categoryDetails.id
        : categoryDetails.parentSecondaryCategoryId || undefined,
    tertiaryCategoryId:
      categoryDetails.type === "TERTIARY"
        ? categoryDetails.id
        : categoryDetails.parentTertiaryCategoryId || undefined,
    quaternaryCategoryId:
      categoryDetails.type === "QUATERNARY" ? categoryDetails.id : undefined,
  };

  return (
    <ContentLayout title={`Edit ${categoryDetails.name}`} isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <CategoryForm categoryDetails={categoryDetails} />

      <div className="mt-10 container pt-8 pb-4 px-4 sm:px-8">
        <h2 className="text-xl font-semibold mb-6">Category Products</h2>
        <Suspense fallback={<ProductsLoading />}>
          <MobileProductList {...categoryIds} />
          <DesktopProductList {...categoryIds} />
        </Suspense>
      </div>
    </ContentLayout>
  );
}
