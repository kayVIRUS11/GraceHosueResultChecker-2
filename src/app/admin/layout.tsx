import type { ReactNode } from "react";

// This layout applies to all routes under /admin, including /admin/login
// We keep it minimal to not interfere with unauthenticated pages.
export default function AdminSectionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
