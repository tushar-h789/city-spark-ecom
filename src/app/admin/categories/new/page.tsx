import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import CategoryForm from "../_components/category-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Categories", href: "/admin/categories" },
  {
    label: "Add New Category",
    href: "/admin/categories/new",
    isCurrentPage: true,
  },
];

export default async function CreateCategoryPage() {
  return (
    <ContentLayout title="Create Category" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <CategoryForm />
    </ContentLayout>
  );
}
