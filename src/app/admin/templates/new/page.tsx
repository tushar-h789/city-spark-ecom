import { ContentLayout } from "../../_components/content-layout";
import DynamicBreadcrumb from "../../_components/dynamic-breadcrumb";
import TemplateForm from "../_components/template-form";

const breadcrumbItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Templates", href: "/admin/templates" },
  {
    label: "Add New Template",
    href: "/admin/templates/new",
    isCurrentPage: true,
  },
];

export default function AdminCreateTemplatePage() {
  return (
    <ContentLayout title="Create Template" isContainer={false}>
      <div className="container pt-8 pb-4 px-4 sm:px-8">
        <DynamicBreadcrumb items={breadcrumbItems} />
      </div>
      <TemplateForm />
    </ContentLayout>
  );
}
