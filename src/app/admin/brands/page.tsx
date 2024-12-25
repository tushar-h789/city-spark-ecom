import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import DesktopBrandList from "./_components/desktop-brand-list";
import BrandTableHeader from "./_components/brand-table-header";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Brands",
    href: "/admin/brands",
    isCurrentPage: true,
  },
];

export default async function AdminBrandsPage() {
  return (
    <ContentLayout title="Brands">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <BrandTableHeader />
      <DesktopBrandList />
    </ContentLayout>
  );
}
