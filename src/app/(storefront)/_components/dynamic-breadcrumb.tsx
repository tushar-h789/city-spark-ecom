"use client";

import React from "react";
import Link from "next/link";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemProps {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemProps[];
}

const DynamicBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const homeItem: BreadcrumbItemProps = {
    label: "Home",
    href: "/",
    icon: <HomeIcon className="h-4 w-4" />,
  };

  const allItems = [homeItem, ...items];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {allItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <BreadcrumbItem
              className={
                item.isCurrentPage
                  ? "text-secondary"
                  : "text-white hover:text-secondary transition-colors"
              }
            >
              {item.icon && (
                <span className="mr-1 inline-flex items-center">
                  {item.icon}
                </span>
              )}
              {item.isCurrentPage ? (
                <BreadcrumbPage className="text-secondary">
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link
                    href={item.href ?? ""}
                    className="hover:text-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>

            {allItems.length - 1 !== index && (
              <BreadcrumbSeparator className="text-white" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
