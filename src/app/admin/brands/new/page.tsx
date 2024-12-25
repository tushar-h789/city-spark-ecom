import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import BrandForm from "../_components/brand-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Brands", href: "/admin/brands" },
  {
    label: "Add New Brand",
    href: "/admin/brands/new",
    isCurrentPage: true,
  },
];

export default async function CreateBrandPage() {
  return (
    <ContentLayout title="Create Brand" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <BrandForm />
    </ContentLayout>
  );
}
