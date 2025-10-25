import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, ClipboardEdit } from "lucide-react";
import Link from "next/link";

const dashboardItems = [
    {
        title: "Enter Scores",
        href: "/teacher/scores",
        icon: <ClipboardEdit className="w-8 h-8 text-primary" />,
        description: "Input and update scores for your students.",
    },
    {
        title: "View Broadsheet",
        href: "/teacher/broadsheet",
        icon: <BookMarked className="w-8 h-8 text-primary" />,
        description: "See a complete overview of class results.",
    },
];

export default function TeacherDashboardPage() {
  return (
    <>
      <PageHeader
        title="Teacher Dashboard"
        description="Welcome! Here are your tools to manage student performance."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
