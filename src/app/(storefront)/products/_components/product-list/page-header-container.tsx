import { BreadcrumbItem } from "@/types/misc";
import React from "react";
import { getCategoryById } from "../../actions";
import { CategoryType } from "@prisma/client";
import { customSlugify } from "@/lib/functions";
import PageHeader from "@/app/(storefront)/_components/page-header";

type PageHeaderContainerProps = {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
  isPrimaryRequired?: boolean;
  isSecondaryRequired?: boolean;
  isTertiaryRequired?: boolean;
  isQuaternaryRequired?: boolean;
  isSearch?: boolean;
  search?: string;
};

export default async function PageHeaderContainer({
  primaryCategoryId,
  secondaryCategoryId,
  tertiaryCategoryId,
  quaternaryCategoryId,
  isPrimaryRequired,
  isSecondaryRequired,
  isTertiaryRequired,
  isQuaternaryRequired,
  isSearch,
  search,
}: PageHeaderContainerProps) {
  let currentCategory;

  if (isQuaternaryRequired && quaternaryCategoryId) {
    currentCategory = await getCategoryById(quaternaryCategoryId);
  } else if (isTertiaryRequired && tertiaryCategoryId) {
    currentCategory = await getCategoryById(tertiaryCategoryId);
  } else if (isSecondaryRequired && secondaryCategoryId) {
    currentCategory = await getCategoryById(secondaryCategoryId);
  } else if (isPrimaryRequired && primaryCategoryId) {
    currentCategory = await getCategoryById(primaryCategoryId);
  }

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Products", href: "/products" },
  ];

  if (isSearch) {
    breadcrumbItems.push({ label: "Search", isCurrentPage: true });
  } else {
    if (isQuaternaryRequired && quaternaryCategoryId) {
      currentCategory = await getCategoryById(quaternaryCategoryId);
    } else if (isTertiaryRequired && tertiaryCategoryId) {
      currentCategory = await getCategoryById(tertiaryCategoryId);
    } else if (isSecondaryRequired && secondaryCategoryId) {
      currentCategory = await getCategoryById(secondaryCategoryId);
    } else if (isPrimaryRequired && primaryCategoryId) {
      currentCategory = await getCategoryById(primaryCategoryId);
    }

    if (currentCategory) {
      if (currentCategory.type === CategoryType.QUATERNARY) {
        breadcrumbItems.push(
          {
            label: currentCategory.parentPrimaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}`,
          },
          {
            label: currentCategory.parentSecondaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentSecondaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}&s_id=${
              currentCategory.parentSecondaryCategory!.id
            }`,
          },
          {
            label: currentCategory.parentTertiaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentSecondaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentTertiaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}&s_id=${
              currentCategory.parentSecondaryCategory!.id
            }&t_id=${currentCategory.parentTertiaryCategory!.id}`,
          }
        );
      } else if (currentCategory.type === CategoryType.TERTIARY) {
        breadcrumbItems.push(
          {
            label: currentCategory.parentPrimaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}`,
          },
          {
            label: currentCategory.parentSecondaryCategory!.name,
            href: `/products/c/${customSlugify(
              currentCategory.parentPrimaryCategory!.name
            )}/${customSlugify(
              currentCategory.parentSecondaryCategory!.name
            )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}&s_id=${
              currentCategory.parentSecondaryCategory!.id
            }`,
          }
        );
      } else if (currentCategory.type === CategoryType.SECONDARY) {
        breadcrumbItems.push({
          label: currentCategory.parentPrimaryCategory!.name,
          href: `/products/c/${customSlugify(
            currentCategory.parentPrimaryCategory!.name
          )}/c?p_id=${currentCategory.parentPrimaryCategory!.id}`,
        });
      }

      breadcrumbItems.push({
        label: currentCategory.name,
        isCurrentPage: true,
      });
    }
  }

  return (
    <PageHeader
      breadcrumbItems={breadcrumbItems}
      title={
        isSearch
          ? `Search Results for "${search}"`
          : currentCategory?.name || "Products"
      }
    />
  );
}
