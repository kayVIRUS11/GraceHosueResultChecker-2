import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import type { NavItem } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BarChart2, Calendar, CreditCard, Home, Settings, Users, FileText } from "lucide-react";
import type { ReactNode } from "react";

const adminNavItems: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: <Home />, tooltip: "Dashboard" },
  { href: "/admin/students", label: "Students", icon: <Users />, tooltip: "Manage Students" },
  { href: "/admin/staff", label: "Staff", icon: <Users />, tooltip: "Manage Staff" },
  { href: "/admin/sessions", label: "Sessions", icon: <Calendar />, tooltip: "Manage Sessions" },
  { href: "/admin/scratch-cards", label: "Scratch Cards", icon: <CreditCard />, tooltip: "Manage Scratch Cards" },
  { href: "/admin/reports", label: "Reports", icon: <FileText />, tooltip: "Generate Reports" },
  { href: "/admin/results", label: "Results", icon: <BarChart2 />, tooltip: "Manage Results" },
  { href: "/admin/settings", label: "Settings", icon: <Settings />, tooltip: "System Settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const user = {
    name: "Admin User",
    role: "Admin" as const,
    dashboardUrl: "/admin/dashboard",
  };
  return (
    <SidebarProvider>
      <AppSidebar navItems={adminNavItems} />
      <SidebarInset>
        <AppHeader user={user} />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
