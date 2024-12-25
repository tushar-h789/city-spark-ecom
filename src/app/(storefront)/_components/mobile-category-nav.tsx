import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import MobileCategoryNavCarousel from "./mobile-category-nav-carousel";
import { Prisma } from "@prisma/client";

type SecondaryNavCategory = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    type: true;
    parentPrimaryCategory: {
      select: {
        id: true;
        name: true;
      };
    };
  };
}>;

// Type for primary categories
type PrimaryNavCategory = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    type: true;
  };
}>;

// Union type since array contains both types
type NavCategory = SecondaryNavCategory | PrimaryNavCategory;

export default function MobileCategoryNav({
  categories,
}: {
  categories: NavCategory[];
}) {
  return (
    <div className="lg:hidden mt-5">
      <div className="px-4 mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-lg">Categories</h2>
        <Link
          href="/products"
          className="flex items-center text-sm text-primary"
        >
          Explore All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <MobileCategoryNavCarousel categories={categories} />
    </div>
  );
}
