import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Calendar, CreditCard, FileText, Settings, Users } from "lucide-react";
import Link from "next/link";

const dashboardItems = [
    { title: "Manage Students", href: "/admin/students", icon: <Users className="w-8 h-8 text-primary" />, description: "Add, edit, and view student records." },
    { title: "Manage Staff", href: "/admin/staff", icon: <Users className="w-8 h-8 text-primary" />, description: "Manage teacher and administrator accounts." },
    { title: "Manage Sessions", href: "/admin/sessions", icon: <Calendar className="w-8 h-8 text-primary" />, description: "Control academic sessions and terms." },
    { title: "Scratch Cards", href: "/admin/scratch-cards", icon: <CreditCard className="w-8 h-8 text-primary" />, description: "Generate and manage result access cards." },
    { title: "Generate Reports", href: "/admin/reports", icon: <FileText className="w-8 h-8 text-primary" />, description: "Create and export detailed reports." },
    { title: "Result Management", href: "/admin/results", icon: <BarChart2 className="w-8 h-8 text-primary" />, description: "Oversee and lock term results." },
    { title: "System Settings", href: "/admin/settings", icon: <Settings className="w-8 h-8 text-primary" />, description: "Configure application-wide settings." },
];

export default function AdminDashboardPage() {
  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Welcome, Admin! Manage your school from here."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardItems.map(item => (
            <Link href={item.href} key={item.title}>
                <Card className="hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium font-headline">
                            {item.title}
                        </CardTitle>
                        {item.icon}
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            </Link>
        ))}
      </div>
    </>
  );
}
