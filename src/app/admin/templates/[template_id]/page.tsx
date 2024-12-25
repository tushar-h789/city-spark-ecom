"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import TemplateForm from "../_components/template-form";
import {
  fetchTemplateDetails,
  TemplateWithDetails,
} from "@/services/admin-templates";

type PageParams = Promise<{
  template_id: string;
}>;

export default function AdminEditTemplatePage(props: { params: PageParams }) {
  const { template_id } = React.use(props.params);

  const {
    data: templateDetails,
    isLoading,
    isError,
    error,
  } = useQuery<TemplateWithDetails, Error>({
    queryKey: ["template", template_id],
    queryFn: () => fetchTemplateDetails(template_id),
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Templates", href: "/admin/templates" },
    {
      label: isLoading
        ? "Loading..."
        : `Edit ${templateDetails?.name || "Template"}`,
      href: `/admin/templates/${template_id}`,
      isCurrentPage: true,
    },
  ];

  if (isLoading) {
    return (
      <ContentLayout title="Edit Template">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ContentLayout>
    );
  }

  if (isError) {
    return (
      <ContentLayout title="Edit Template">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error?.message || "Failed to load template details"}
          </AlertDescription>
        </Alert>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Edit Template" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      {templateDetails && <TemplateForm templateDetails={templateDetails} />}
    </ContentLayout>
  );
}
