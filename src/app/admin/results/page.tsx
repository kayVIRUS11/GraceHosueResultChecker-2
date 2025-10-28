import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminDashboardLayout from "../dashboard/layout";

export default function AdminResultsPage() {
  return (
    <AdminDashboardLayout>
      <PageHeader
        title="Manage Results"
        description="This feature is coming soon."
      />
      <Card>
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>
            The ability to oversee, lock, and manage term results is being developed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Check back later for updates!</p>
        </CardContent>
      </Card>
    </AdminDashboardLayout>
  );
}
