import { PageHeader } from "@/components/page-header";
import { StudentActions } from "@/components/admin/student-actions";

export default function AdminStudentsPage() {
  return (
    <>
      <PageHeader
        title="Manage Students"
        description="View, add, and edit student records."
      />
      <StudentActions />
    </>
  );
}
