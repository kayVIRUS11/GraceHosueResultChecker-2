import { AdminLoginForm } from "@/components/auth/admin-login-form";
import Logo from "@/components/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Logo />
            </div>
            <CardTitle className="font-headline text-3xl">Admin Portal</CardTitle>
            <CardDescription>Sign in to manage the school</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminLoginForm />
          </CardContent>
        </Card>
         <p className="mt-4 text-center text-sm text-muted-foreground">
          <Link href="/" className="underline hover:text-primary">
            Student Login
          </Link>
          {' | '}
          <Link href="/teacher/login" className="underline hover:text-primary">
            Staff Login
          </Link>
        </p>
      </div>
    </main>
  );
}
