import { ContentLayout } from "../_components/content-layout";
import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import TemplateList from "./_components/desktop-template-list";
import TemplateTableHeader from "./_components/template-table-header";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates", isCurrentPage: true },
];

export default async function AdminTemplatesPage() {
  return (
    <ContentLayout title="Templates">
      <DynamicBreadcrumb items={breadcrumbItems} />
      <TemplateTableHeader />
      <TemplateList />
    </ContentLayout>
  );
}
