import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { NavItem } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BookMarked, ClipboardEdit, Home } from "lucide-react";
import type { ReactNode } from "react";

const teacherNavItems: NavItem[] = [
  { href: "/teacher/dashboard", label: "Dashboard", icon: <Home />, tooltip: "Dashboard" },
  { href: "/teacher/scores", label: "Enter Scores", icon: <ClipboardEdit />, tooltip: "Enter Scores" },
  { href: "/teacher/broadsheet", label: "Broadsheet", icon: <BookMarked />, tooltip: "View Broadsheet" },
];

export default function TeacherDashboardLayout({ children }: { children: ReactNode }) {
  const user = {
    name: "Jane Smith",
    role: "Teacher" as const,
    dashboardUrl: "/teacher/dashboard",
  };
  return (
    <SidebarProvider>
      <AppSidebar navItems={teacherNavItems} />
      <SidebarInset>
        <AppHeader user={user} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
