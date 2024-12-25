import React from "react";
import Link from "next/link";
import CategoryCard from "./category-card";
import { CategoryWithRelations } from "@/types/storefront-products";
import { customSlugify } from "@/lib/functions";
import { getCategoriesByType } from "../../actions";
import { CategoryType } from "@prisma/client";

interface DynamicCategoryGridProps {
  primaryId?: string;
  secondaryId?: string;
  tertiaryId?: string;
}

export default async function DynamicCategoryGrid({
  primaryId,
  secondaryId,
  tertiaryId,
}: DynamicCategoryGridProps) {
  let categories;

  if (tertiaryId && secondaryId && primaryId) {
    const { categories: quaternaryCategories } = await getCategoriesByType(
      CategoryType.QUATERNARY,
      primaryId,
      secondaryId,
      tertiaryId
    );
    categories = quaternaryCategories;
  } else if (secondaryId && primaryId) {
    const { categories: tertiaryCategories } = await getCategoriesByType(
      CategoryType.TERTIARY,
      primaryId,
      secondaryId
    );
    categories = tertiaryCategories;
  } else if (primaryId) {
    const { categories: secondaryCategories } = await getCategoriesByType(
      CategoryType.SECONDARY,
      primaryId
    );
    categories = secondaryCategories;
  } else {
    const { categories: primaryCategories } = await getCategoriesByType(
      CategoryType.PRIMARY,
      ""
    );
    categories = primaryCategories;
  }

  const generateCategoryUrl = (category: CategoryWithRelations) => {
    const urlParts: string[] = [];
    const queryParts: string[] = [];

    if (!primaryId) {
      // First level - Primary categories
      urlParts.push(customSlugify(category.name));
      queryParts.push(`p_id=${category.id}`);
    } else if (!secondaryId) {
      // Second level - Secondary categories
      urlParts.push(
        customSlugify(category.parentPrimaryCategory?.name || ""),
        customSlugify(category.name)
      );
      queryParts.push(`p_id=${primaryId}`, `s_id=${category.id}`);
    } else if (!tertiaryId) {
      // Third level - Tertiary categories
      urlParts.push(
        customSlugify(category.parentPrimaryCategory?.name || ""),
        customSlugify(category.parentSecondaryCategory?.name || ""),
        customSlugify(category.name)
      );
      queryParts.push(
        `p_id=${primaryId}`,
        `s_id=${secondaryId}`,
        `t_id=${category.id}`
      );
    } else {
      // Fourth level - Quaternary categories
      urlParts.push(
        customSlugify(category.parentPrimaryCategory?.name || ""),
        customSlugify(category.parentSecondaryCategory?.name || ""),
        customSlugify(category.parentTertiaryCategory?.name || ""),
        customSlugify(category.name)
      );
      queryParts.push(
        `p_id=${primaryId}`,
        `s_id=${secondaryId}`,
        `t_id=${tertiaryId}`,
        `q_id=${category.id}`
      );
    }

    return `/products/c/${urlParts.filter(Boolean).join("/")}/c?${queryParts
      .filter(Boolean)
      .join("&")}`;
  };

  return (
    <div className="col-span-1 lg:col-span-9">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-fr mt-5">
        {categories.map((category) => (
          <div key={category.id} className="h-full">
            <Link
              href={generateCategoryUrl(category as CategoryWithRelations)}
              className="h-full block"
            >
              <CategoryCard category={category as CategoryWithRelations} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
