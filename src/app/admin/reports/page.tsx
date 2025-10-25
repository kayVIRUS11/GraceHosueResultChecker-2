import { PageHeader } from "@/components/page-header";
import { ReportGenerator } from "@/components/admin/report-generator";

export default function AdminReportsPage() {
  return (
    <>
      <PageHeader
        title="Report Generation"
        description="Generate comprehensive reports and get AI-powered insights."
      />
      <ReportGenerator />
    </>
  );
}
