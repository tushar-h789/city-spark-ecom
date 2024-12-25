import React from "react";
import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import ProductForm from "../_components/product-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  {
    label: "Add New Product",
    href: "/admin/products/new",
    isCurrentPage: true,
  },
];

export default async function AdminCreateProductPage() {
  return (
    <ContentLayout title="Add New Product" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>

      <ProductForm />
    </ContentLayout>
  );
}
