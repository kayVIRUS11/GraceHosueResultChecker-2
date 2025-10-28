import type { ReactNode } from "react";

// This layout applies to all routes under /teacher, including /teacher/login
// We keep it minimal to not interfere with unauthenticated pages.
export default function TeacherSectionLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
