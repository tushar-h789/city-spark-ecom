import React from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import DesktopOrderList from "./_components/desktop-orders-list";
import OrderTableHeader from "./_components/order-table-header";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  {
    label: "Orders",
    href: "/admin/orders",
    isCurrentPage: true,
  },
];

export default function AdminOrdersPage() {
  return (
    <ContentLayout title="Orders">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <OrderTableHeader />
      <DesktopOrderList />
    </ContentLayout>
  );
}
