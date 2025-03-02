import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UserMenu } from "@/components/user-menu";
import { ModeToggle } from "@/components/mode-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">TrialGuard</h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserMenu user={user} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-6">{children}</main>
    </div>
  );
}
