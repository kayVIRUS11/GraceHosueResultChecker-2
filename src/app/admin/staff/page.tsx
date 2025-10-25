import { PageHeader } from "@/components/page-header";
import { StaffActions } from "@/components/admin/staff-actions";

export default function AdminStaffPage() {
  return (
    <>
      <PageHeader
        title="Manage Staff"
        description="Add, edit, and manage staff accounts."
      />
      <StaffActions />
    </>
  );
}
