import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { NavItem } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BarChart, BookOpen, Home } from "lucide-react";
import type { ReactNode } from "react";

const studentNavItems: NavItem[] = [
  { href: "/student/dashboard", label: "Dashboard", icon: <Home />, tooltip: "Dashboard" },
  { href: "/student/results", label: "Results", icon: <BookOpen />, tooltip: "View Results" },
  { href: "/student/analytics", label: "Performance", icon: <BarChart />, tooltip: "Performance Analytics" },
];

export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const user = {
    name: "John Doe",
    role: "Student" as const,
    dashboardUrl: "/student/dashboard",
  };
  return (
    <SidebarProvider>
      <AppSidebar navItems={studentNavItems} />
      <SidebarInset>
        <AppHeader user={user} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
