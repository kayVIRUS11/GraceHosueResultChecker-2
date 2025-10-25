import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStaffPage() {
  return (
    <>
      <PageHeader
        title="Manage Staff"
        description="This feature is coming soon."
      />
      <Card>
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>
            The ability to add, edit, and manage staff accounts is being developed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Check back later for updates!</p>
        </CardContent>
      </Card>
    </>
  );
}
