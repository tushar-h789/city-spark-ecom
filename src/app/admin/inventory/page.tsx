import { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import DesktopInventoryList from "./_components/desktop-inventory-list";
import InventoryTableHeader from "./_components/inventory-table-header";
import InventoryLoading from "./_components/inventory-loading";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Inventory", href: "/admin/inventory", isCurrentPage: true },
];

export default async function InventoryPage() {
  return (
    <ContentLayout title="Inventory">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <InventoryTableHeader />
      <Suspense fallback={<InventoryLoading />}>
        <DesktopInventoryList />
      </Suspense>
    </ContentLayout>
  );
}
