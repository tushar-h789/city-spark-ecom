import React from "react";
import MobileCategoryNav from "./mobile-category-nav";
import prisma from "@/lib/prisma";

import { unstable_cache as cache } from "next/cache";

async function fetchCategories() {
  // First fetch Boilers and Radiators (secondary categories)
  const secondaryCategories = await prisma.category.findMany({
    where: {
      type: "SECONDARY",
      OR: [
        { name: { equals: "Boilers", mode: "insensitive" } },
        { name: { equals: "Radiators", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      type: true,
      parentPrimaryCategory: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Then fetch primary categories (excluding Boilers and Radiators)
  const primaryCategories = await prisma.category.findMany({
    where: {
      type: "PRIMARY",
      name: {
        notIn: ["Boilers", "Radiators"],
      },
    },
    select: {
      id: true,
      name: true,
      type: true,
    },
  });

  return [...secondaryCategories, ...primaryCategories];
}

export const getCategoriesForNav = cache(
  fetchCategories,
  ["getCategoriesForNav"],
  {
    revalidate: 3600, // Revalidate cache every 60 seconds
  }
);

export default async function MobileCategoryNavContainer() {
  const categories = await getCategoriesForNav();

  return <MobileCategoryNav categories={categories} />;
}
