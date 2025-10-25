import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSessionsPage() {
  return (
    <>
      <PageHeader
        title="Manage Sessions"
        description="This feature is coming soon."
      />
      <Card>
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>
            The ability to manage academic sessions and terms is being developed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Check back later for updates!</p>
        </CardContent>
      </Card>
    </>
  );
}
