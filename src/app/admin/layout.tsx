import AdminBottomNav from "./_components/admin-bottom-nav";
import AdminPanelLayout from "./_components/admin-panel-layout";
import AdminTopLoader from "./_components/admin-top-loader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminPanelLayout>
      <AdminTopLoader />
      {children}

      <AdminBottomNav />
    </AdminPanelLayout>
  );
}
