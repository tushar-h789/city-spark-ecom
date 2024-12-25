"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CategoryType } from "@prisma/client";
import { customSlugify } from "@/lib/functions";
import BoilerIcon from "@/components/icons/boiler";
import RadiatorIcon from "@/components/icons/radiator";
import HeatingIcon from "@/components/icons/heating";
import PlumbingIcon from "@/components/icons/plumbing";
import BathroomIcon from "@/components/icons/bathroom";
import KitchenTilesIcon from "@/components/icons/kitchen-tiles";
import SparesIcon from "@/components/icons/spares";
import RenewablesIcon from "@/components/icons/renewables";
import ToolsIcon from "@/components/icons/tools";
import ElectricalIcon from "@/components/icons/electrical";

type IconProps = {
  className?: string;
  height?: number | string;
  width?: number | string;
};

type NavCategory = {
  id: string;
  name: string;
  type: CategoryType;
  parentPrimaryCategory?: {
    id: string;
    name: string;
  } | null;
};

type CategoryWithIcon = NavCategory & {
  Icon: React.ComponentType<IconProps>;
  route: string;
  ariaLabel: string;
};

const categoryIcons: Record<
  string,
  { Icon: React.ComponentType<IconProps>; ariaLabel: string }
> = {
  boilers: { Icon: BoilerIcon, ariaLabel: "Browse boiler products" },
  radiators: { Icon: RadiatorIcon, ariaLabel: "Browse radiator products" },
  heating: { Icon: HeatingIcon, ariaLabel: "Browse heating products" },
  plumbing: { Icon: PlumbingIcon, ariaLabel: "Browse plumbing products" },
  bathrooms: { Icon: BathroomIcon, ariaLabel: "Browse bathroom products" },
  kitchen: { Icon: KitchenTilesIcon, ariaLabel: "Browse kitchen products" },
  spares: { Icon: SparesIcon, ariaLabel: "Browse spare parts" },
  renewables: { Icon: RenewablesIcon, ariaLabel: "Browse renewable products" },
  tools: { Icon: ToolsIcon, ariaLabel: "Browse tools" },
  electrical: { Icon: ElectricalIcon, ariaLabel: "Browse electrical products" },
};

function createCategory(category: NavCategory): CategoryWithIcon | null {
  const iconData = categoryIcons[category.name.toLowerCase()];
  if (!iconData) return null;

  const route =
    category.type === CategoryType.SECONDARY && category.parentPrimaryCategory
      ? `/products/c/${customSlugify(
          category.parentPrimaryCategory.name
        )}/${customSlugify(category.name)}/c?p_id=${
          category.parentPrimaryCategory.id
        }&s_id=${category.id}`
      : `/products/c/${customSlugify(category.name)}/c?p_id=${category.id}`;

  return {
    ...category,
    Icon: iconData.Icon,
    route,
    ariaLabel: iconData.ariaLabel,
  };
}

export default function MobileCategoryNavCarousel({
  categories,
}: {
  categories: NavCategory[];
}) {
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    skipSnaps: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const processedCategories = categories
    .map(createCategory)
    .filter((category): category is CategoryWithIcon => category !== null);

  return (
    <nav
      className="pl-4 block lg:hidden"
      aria-label="Mobile category navigation"
    >
      <div
        className="overflow-hidden"
        ref={emblaRef}
        role="region"
        aria-label="Scrollable categories"
        tabIndex={0}
      >
        <ul className="flex" role="list" aria-label="Product categories">
          {processedCategories.map((item) => (
            <li
              key={item.id}
              className="flex-none w-[31%] min-w-[110px] pr-3"
              role="listitem"
            >
              <Link
                href={item.route}
                className={cn(
                  "flex flex-col items-center p-4 w-full transition-all duration-200",
                  "hover:bg-primary/5 group rounded-xl",
                  "border border-border hover:border-primary/20",
                  "bg-white",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                )}
                aria-label={item.ariaLabel}
              >
                <item.Icon
                  className={cn(
                    "transition-all duration-200 text-gray-600",
                    "group-hover:text-primary group-hover:scale-110"
                  )}
                  height={32}
                  width={32}
                  aria-hidden="true"
                />
                <h2
                  className={cn(
                    "text-xs mt-3 text-center font-medium",
                    "group-hover:text-primary transition-colors duration-200"
                  )}
                >
                  {item.name}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
