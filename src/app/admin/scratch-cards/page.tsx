import { PageHeader } from "@/components/page-header";
import { ScratchCardGenerator } from "@/components/admin/scratch-card-generator";

export default function AdminScratchCardsPage() {
  return (
    <>
      <PageHeader
        title="Manage Scratch Cards"
        description="Generate, view, and manage result-checker scratch cards."
      />
      <ScratchCardGenerator />
    </>
  );
}
