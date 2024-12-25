import DynamicBreadcrumb from "../_components/dynamic-breadcrumb";
import { ContentLayout } from "../_components/content-layout";

type PageParams = Promise<{
  slug?: string[];
}>;

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard", isCurrentPage: true },
];

export default async function AdminPage(props: { params: PageParams }) {
  const params = await props.params;
  const slug = params.slug;

  const renderContent = (title: string) => (
    <ContentLayout title={title}>
      <DynamicBreadcrumb items={breadcrumbItems} />
    </ContentLayout>
  );

  if (!slug || (slug.length === 1 && slug[0] === "dashboard")) {
    return renderContent("Dashboard");
  }

  throw new Error("Page not found");
}
