"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import BrandForm from "../_components/brand-form";
import { fetchBrandDetails, BrandWithDetails } from "@/services/admin-brands";

type PageParams = Promise<{
  brand_id: string;
}>;

export default function AdminBrandDetailsPage(props: { params: PageParams }) {
  const { brand_id } = React.use(props.params);

  const {
    data: brandDetails,
    isLoading,
    isError,
    error,
  } = useQuery<BrandWithDetails, Error>({
    queryKey: ["brand", brand_id],
    queryFn: () => fetchBrandDetails(brand_id),
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Brands", href: "/admin/brands" },
    {
      label: isLoading ? "Loading..." : `Edit ${brandDetails?.name || "Brand"}`,
      href: `/admin/brands/${brand_id}`,
      isCurrentPage: true,
    },
  ];

  if (isLoading) {
    return (
      <ContentLayout title="Edit Brand">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout title="Edit Brand">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load brand details"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Edit Brand" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      {brandDetails && <BrandForm brandDetails={brandDetails} />}
    </ContentLayout>
  );
}
