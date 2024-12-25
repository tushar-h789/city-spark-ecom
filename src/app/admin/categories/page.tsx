import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import CategoryTableHeader from "./_components/category-table-header";
import CategoriesLoading from "./_components/categories-loading";
import DesktopCategoryList from "./_components/desktop-category-list";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Categories",
    href: "/admin/categories",
    isCurrentPage: true,
  },
];

export default async function AdminCategoriesPage() {
  return (
    <ContentLayout title="Categories">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <CategoryTableHeader />
      <Suspense fallback={<CategoriesLoading />}>
        <DesktopCategoryList />
      </Suspense>
    </ContentLayout>
  );
}
