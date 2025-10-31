import { PageHeader } from "@/components/page-header";
import { SessionActions } from "@/components/admin/session-actions";

export default function AdminSessionsPage() {
  return (
    <>
      <PageHeader
        title="Manage Sessions"
        description="Create, view, and manage academic sessions and terms."
      />
      <SessionActions />
    </>
  );
}
