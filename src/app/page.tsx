import { StudentLoginForm } from "@/components/auth/student-login-form";
import Logo from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-3xl">Welcome to MeritMark</CardTitle>
            <CardDescription>Enter your details to view your results</CardDescription>
          </CardHeader>
          <CardContent>
            <StudentLoginForm />
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-xs text-muted-foreground">
            <Link href="/admin/login" className="hover:text-primary">
                Admin Login
            </Link>
            {' | '}
            <Link href="/teacher/login" className="hover:text-primary">
                Staff Login
            </Link>
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MeritMark. All rights reserved.
        </p>
      </div>
    </main>
  );
}
