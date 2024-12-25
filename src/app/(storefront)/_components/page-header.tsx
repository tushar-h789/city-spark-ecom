import React from "react";
import DynamicBreadcrumb from "./dynamic-breadcrumb";
import { BreadcrumbItem } from "@/types/misc";

interface PageHeaderProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbItems }) => {
  return (
    <section className="hidden lg:block bg-primary py-8">
      <div className="container mx-auto max-w-screen-xl">
        <DynamicBreadcrumb items={breadcrumbItems} />
        <h1 className="text-white text-4xl font-bold mt-4">{title}</h1>
      </div>
    </section>
  );
};

export default PageHeader;
