import { PageHeader } from "@/components/page-header";
import { ReportGenerator } from "@/components/admin/report-generator";
import AdminDashboardLayout from "../dashboard/layout";

export default function AdminReportsPage() {
  return (
    <AdminDashboardLayout>
      <PageHeader
        title="Report Generation"
        description="Generate comprehensive reports and get AI-powered insights."
      />
      <ReportGenerator />
    </AdminDashboardLayout>
  );
}
