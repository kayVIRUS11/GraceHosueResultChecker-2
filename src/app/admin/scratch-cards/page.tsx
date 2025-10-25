import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminScratchCardsPage() {
  return (
    <>
      <PageHeader
        title="Manage Scratch Cards"
        description="This feature is coming soon."
      />
      <Card>
        <CardHeader>
          <CardTitle>Under Construction</CardTitle>
          <CardDescription>
            The ability to generate and manage scratch cards is being developed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Check back later for updates!</p>
        </CardContent>
      </Card>
    </>
  );
}
