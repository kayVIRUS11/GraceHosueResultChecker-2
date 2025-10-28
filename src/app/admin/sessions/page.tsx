import { PageHeader } from "@/components/page-header";
import { SessionActions } from "@/components/admin/session-actions";
import AdminDashboardLayout from "../dashboard/layout";

export default function AdminSessionsPage() {
  return (
    <AdminDashboardLayout>
      <PageHeader
        title="Manage Sessions"
        description="Create, view, and manage academic sessions and terms."
      />
      <SessionActions />
    </AdminDashboardLayout>
  );
}
