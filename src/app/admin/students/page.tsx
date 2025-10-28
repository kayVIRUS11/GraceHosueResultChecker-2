import { PageHeader } from "@/components/page-header";
import { StudentActions } from "@/components/admin/student-actions";
import AdminDashboardLayout from "../dashboard/layout";

export default function AdminStudentsPage() {
  return (
    <AdminDashboardLayout>
      <PageHeader
        title="Manage Students"
        description="View, add, and edit student records."
      />
      <StudentActions />
    </AdminDashboardLayout>
  );
}
