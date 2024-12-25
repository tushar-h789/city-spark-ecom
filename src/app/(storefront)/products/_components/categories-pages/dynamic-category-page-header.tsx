import React from "react";
import { getCategoryById } from "../../actions";
import { customSlugify } from "@/lib/functions";
import PageHeader from "@/app/(storefront)/_components/page-header";
import { BreadcrumbItem } from "@/types/misc";

type DynamicPageHeaderProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
};

export default async function DynamicPageHeader({
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
  quaternaryCategoryId,
}: DynamicPageHeaderProps) {
  // Start with base breadcrumb
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", href: "/products" },
  ];

  let title = "Products";
  let currentCategory;

  // Fetch the most specific category first
  if (quaternaryCategoryId) {
    currentCategory = await getCategoryById(quaternaryCategoryId);
    if (currentCategory) {
      // Add primary category
      if (currentCategory.parentPrimaryCategory) {
        breadcrumbItems.push({
          label: currentCategory.parentPrimaryCategory.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory.id}`,
        });
      }

      // Add secondary category
      if (currentCategory.parentSecondaryCategory) {
        breadcrumbItems.push({
          label: currentCategory.parentSecondaryCategory.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory?.name
          )}/${customSlugify(
            currentCategory.parentSecondaryCategory.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory?.id}&s_id=${
            currentCategory.parentSecondaryCategory.id
          }`,
        });
      }

      // Add tertiary category
      if (currentCategory.parentTertiaryCategory) {
        breadcrumbItems.push({
          label: currentCategory.parentTertiaryCategory.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory?.name
          )}/${customSlugify(
            currentCategory.parentSecondaryCategory?.name
          )}/${customSlugify(
            currentCategory.parentTertiaryCategory.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory?.id}&s_id=${
            currentCategory.parentSecondaryCategory?.id
          }&t_id=${currentCategory.parentTertiaryCategory.id}`,
        });
      }

      // Add current category
      breadcrumbItems.push({
        label: currentCategory.name,
        isCurrentPage: true,
      });
      title = currentCategory.name;
    }
  } else if (tertiaryCategoryId) {
    currentCategory = await getCategoryById(tertiaryCategoryId);
    if (currentCategory) {
      // Add primary category
      if (currentCategory.parentPrimaryCategory) {
        breadcrumbItems.push({
          label: currentCategory.parentPrimaryCategory.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory.id}`,
        });
      }

      // Add secondary category
      if (currentCategory.parentSecondaryCategory) {
        breadcrumbItems.push({
          label: currentCategory.parentSecondaryCategory.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory?.name
          )}/${customSlugify(
            currentCategory.parentSecondaryCategory.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory?.id}&s_id=${
            currentCategory.parentSecondaryCategory.id
          }`,
        });
      }

      // Add current category
      breadcrumbItems.push({
        label: currentCategory.name,
        isCurrentPage: true,
      });
      title = currentCategory.name;
    }
  } else if (secondaryCategoryId) {
    currentCategory = await getCategoryById(secondaryCategoryId);
    if (currentCategory) {
      // Add primary category
      if (currentCategory.parentPrimaryCategory) {
        breadcrumbItems.push({
          label: currentCategory.parentPrimaryCategory.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory.id}`,
        });
      }

      // Add current category
      breadcrumbItems.push({
        label: currentCategory.name,
        isCurrentPage: true,
      });
      title = currentCategory.name;
    }
  } else if (primaryCategoryId) {
    currentCategory = await getCategoryById(primaryCategoryId);
    if (currentCategory) {
      breadcrumbItems.push({
        label: currentCategory.name,
        isCurrentPage: true,
      });
      title = currentCategory.name;
    }
  }

  return <PageHeader breadcrumbItems={breadcrumbItems} title={title} />;
}
