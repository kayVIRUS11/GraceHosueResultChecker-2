import { PageHeader } from "@/components/page-header";
import { StaffActions } from "@/components/admin/staff-actions";
import AdminDashboardLayout from "../dashboard/layout";

export default function AdminStaffPage() {
  return (
    <AdminDashboardLayout>
      <PageHeader
        title="Manage Staff"
        description="Add, edit, and manage staff accounts."
      />
      <StaffActions />
    </AdminDashboardLayout>
  );
}
