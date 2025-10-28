import { PageHeader } from "@/components/page-header";
import { ScratchCardGenerator } from "@/components/admin/scratch-card-generator";
import AdminDashboardLayout from "../dashboard/layout";

export default function AdminScratchCardsPage() {
  return (
    <AdminDashboardLayout>
      <PageHeader
        title="Manage Scratch Cards"
        description="Generate, view, and manage result-checker scratch cards."
      />
      <ScratchCardGenerator />
    </AdminDashboardLayout>
  );
}
