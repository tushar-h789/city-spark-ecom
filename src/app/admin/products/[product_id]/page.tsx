"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import ProductForm from "../_components/product-form";
import {
  fetchProductDetails,
  ProductWithDetails,
} from "@/services/admin-products";

type PageParams = Promise<{
  product_id: string;
}>;

export default function AdminProductDetailsPage(props: { params: PageParams }) {
  const { product_id } = React.use(props.params);

  const {
    data: productDetails,
    isLoading,
    isError,
    error,
  } = useQuery<ProductWithDetails, Error>({
    queryKey: ["product", product_id],
    queryFn: () => fetchProductDetails(product_id),
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Products", href: "/admin/products" },
    {
      label: isLoading
        ? "Loading..."
        : `Edit ${productDetails?.name || "Product"}`,
      href: `/admin/products/${product_id}`,
      isCurrentPage: true,
    },
  ];

  if (isLoading) {
    return (
      <ContentLayout title="Edit Product">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout title="Edit Product">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load product details"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Edit Product" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      {productDetails && <ProductForm productDetails={productDetails} />}
    </ContentLayout>
  );
}
