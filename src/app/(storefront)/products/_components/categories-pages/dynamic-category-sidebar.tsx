import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { customSlugify } from "@/lib/functions";
import CategoryLink from "./category-link";
import { CategoryType, Prisma } from "@prisma/client";
import { getCategoriesByType, getCategoryById } from "../../actions";

type CurrentCategory = Prisma.CategoryGetPayload<{
  include: {
    parentPrimaryCategory: true;
    parentSecondaryCategory: true;
    parentTertiaryCategory: true;
  };
}>;

// Base interfaces for type safety
interface BaseCategory {
  id: string;
  name: string;
  type: CategoryType;
}

interface ParentCategory {
  id: string;
  name: string;
}

interface CategoryWithParents extends BaseCategory {
  parentPrimaryCategory?: ParentCategory | null;
  parentSecondaryCategory?: ParentCategory | null;
  parentTertiaryCategory?: ParentCategory | null;
}

interface PrimaryCategoryWithChildren extends CategoryWithParents {
  primaryChildCategories?: CategoryWithParents[];
}

interface SecondaryCategoryWithChildren extends CategoryWithParents {
  secondaryChildCategories?: CategoryWithParents[];
}

interface TertiaryCategoryWithChildren extends CategoryWithParents {
  tertiaryChildCategories?: CategoryWithParents[];
}

type CategoryWithChildren =
  | PrimaryCategoryWithChildren
  | SecondaryCategoryWithChildren
  | TertiaryCategoryWithChildren;

interface DynamicCategorySidebarProps {
  primaryCategoryId?: string;
  secondaryCategoryId?: string;
  tertiaryCategoryId?: string;
  quaternaryCategoryId?: string;
}

export default async function DynamicCategorySidebar(
  props: DynamicCategorySidebarProps
) {
  const {
    primaryCategoryId,
    secondaryCategoryId,
    tertiaryCategoryId,
    quaternaryCategoryId,
  } = props;

  let currentCategory: CurrentCategory | undefined;
  let type: CategoryType = "PRIMARY";
  let parentId = "";
  let secondParentId = "";
  let thirdParentId = "";

  // First determine the current category for context
  if (quaternaryCategoryId) {
    currentCategory = await getCategoryById(quaternaryCategoryId);
  } else if (tertiaryCategoryId) {
    currentCategory = await getCategoryById(tertiaryCategoryId);
  } else if (secondaryCategoryId) {
    currentCategory = await getCategoryById(secondaryCategoryId);
  } else if (primaryCategoryId) {
    currentCategory = await getCategoryById(primaryCategoryId);
  }

  // Then set the type and parent IDs for fetching the next level of categories
  if (tertiaryCategoryId) {
    currentCategory = await getCategoryById(tertiaryCategoryId);
    type = "QUATERNARY";
    parentId = primaryCategoryId || "";
    secondParentId = secondaryCategoryId || "";
    thirdParentId = tertiaryCategoryId;
  } else if (secondaryCategoryId) {
    currentCategory = await getCategoryById(secondaryCategoryId);
    type = "TERTIARY";
    parentId = primaryCategoryId || "";
    secondParentId = secondaryCategoryId;
  } else if (primaryCategoryId) {
    currentCategory = await getCategoryById(primaryCategoryId);
    type = "SECONDARY";
    parentId = primaryCategoryId;
  }

  const { categories } = await getCategoriesByType(
    type,
    parentId,
    secondParentId,
    thirdParentId
  );

  // Determine sidebar title based on current category
  const title = currentCategory ? currentCategory.name : "Categories";

  const getChildCategories = (category: CategoryWithChildren) => {
    switch (type) {
      case "SECONDARY":
        return (category as SecondaryCategoryWithChildren)
          .secondaryChildCategories;
      case "TERTIARY":
        return (category as TertiaryCategoryWithChildren)
          .tertiaryChildCategories;
      case "QUATERNARY":
        return undefined; // No children for quaternary categories
      default:
        return (category as PrimaryCategoryWithChildren).primaryChildCategories;
    }
  };

  const generateUrl = (
    category: CategoryWithChildren,
    subcategory?: CategoryWithParents
  ): string => {
    const urlParts: string[] = [];
    const queryParts: string[] = [];

    switch (type) {
      case "PRIMARY":
        urlParts.push(category.name);
        queryParts.push(`p_id=${category.id}`);
        break;

      case "SECONDARY":
        if (subcategory) {
          urlParts.push(
            currentCategory?.name || "",
            category.name,
            subcategory.name
          );
          queryParts.push(
            `p_id=${currentCategory?.id}`,
            `s_id=${category.id}`,
            `t_id=${subcategory.id}`
          );
        } else {
          urlParts.push(currentCategory?.name || "", category.name);
          queryParts.push(`p_id=${currentCategory?.id}`, `s_id=${category.id}`);
        }
        break;

      case "TERTIARY":
        if (subcategory) {
          urlParts.push(
            currentCategory?.parentPrimaryCategory?.name || "",
            currentCategory?.name || "",
            category.name,
            subcategory.name
          );
          queryParts.push(
            `p_id=${currentCategory?.parentPrimaryCategory?.id}`,
            `s_id=${currentCategory?.id}`,
            `t_id=${category.id}`,
            `q_id=${subcategory.id}`
          );
        } else {
          urlParts.push(
            currentCategory?.parentPrimaryCategory?.name || "",
            currentCategory?.name || "",
            category.name
          );
          queryParts.push(
            `p_id=${currentCategory?.parentPrimaryCategory?.id}`,
            `s_id=${currentCategory?.id}`,
            `t_id=${category.id}`
          );
        }
        break;

      case "QUATERNARY":
        urlParts.push(
          currentCategory?.parentPrimaryCategory?.name || "",
          currentCategory?.parentSecondaryCategory?.name || "",
          currentCategory?.name || "",
          category.name
        );
        queryParts.push(
          `p_id=${currentCategory?.parentPrimaryCategory?.id}`,
          `s_id=${currentCategory?.parentSecondaryCategory?.id}`,
          `t_id=${currentCategory?.id}`,
          `q_id=${category.id}`
        );
        break;
    }

    return `/products/c/${urlParts
      .filter(Boolean)
      .map(customSlugify)
      .join("/")}/c?${queryParts.filter(Boolean).join("&")}`;
  };

  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-20">
        <Card className="border-gray-300 rounded-xl shadow-none transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pb-0">
            {categories.map((category, index) => {
              const childCategories = getChildCategories(
                category as CategoryWithChildren
              );

              if (
                childCategories &&
                childCategories.length > 0 &&
                type !== "QUATERNARY"
              ) {
                return (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    key={category.id}
                  >
                    <AccordionItem value={`category-${category.id}`}>
                      <AccordionTrigger className="font-normal hover:no-underline text-sm lg:text-base">
                        {category.name}
                      </AccordionTrigger>
                      <AccordionContent className="py-0">
                        <Separator />
                        <ul className="pl-3">
                          {childCategories.map((subcategory) => (
                            <CategoryLink
                              key={subcategory.id}
                              href={generateUrl(
                                category as CategoryWithChildren,
                                subcategory
                              )}
                              name={subcategory.name}
                            />
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              }

              return (
                <React.Fragment key={category.id}>
                  <CategoryLink
                    href={generateUrl(category as CategoryWithChildren)}
                    name={category.name}
                  />
                  {index !== categories.length - 1 && <Separator />}
                </React.Fragment>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
