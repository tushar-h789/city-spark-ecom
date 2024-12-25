import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import ProductTableHeader from "./_components/product-table-header";
import DesktopProductList from "./_components/desktop-product-list";
import MobileProductList from "./_components/mobile-product-list";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products", isCurrentPage: true },
];

export default function AdminProductsPage() {
  return (
    <ContentLayout title="Products">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <ProductTableHeader />

      <DesktopProductList />
      <MobileProductList />
    </ContentLayout>
  );
}
