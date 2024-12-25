import React, { Suspense } from "react";
import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import UserList from "./_components/users-list";
import { UserPagination } from "./_components/user-pagination";
import UserTableHeader from "./_components/users-table-header";
import UsersLoading from "./_components/users-loading";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Users", href: "/admin/users", isCurrentPage: true },
];
export default function AdminUsersPage() {
  return (
    <ContentLayout title="Users">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <UserTableHeader />
      <Suspense fallback={<UsersLoading />}>
        <UserList />
      </Suspense>
      <UserPagination />
    </ContentLayout>
  );
}
