import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

/**
 * Custom 404 Not Found page
 */
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="space-y-4 max-w-md">
        <h1 className="text-9xl font-extrabold text-gray-700">404</h1>
        <h2 className="text-2xl font-bold tracking-tight">Page Not Found</h2>
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have
          been removed, renamed, or didn't exist in the first place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 w-full max-w-md space-y-2">
        <p className="text-sm font-medium">Looking for one of these?</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" asChild size="sm" className="justify-start">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="justify-start">
            <Link href="/add-subscription">Add Subscription</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="justify-start">
            <Link href="/profile">Profile</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="justify-start">
            <Link href="/cancellation-guides">Cancellation Guides</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="justify-start">
            <Link href="/settings">Settings</Link>
          </Button>
          <Button variant="ghost" asChild size="sm" className="justify-start">
            <Link href="/help">Help</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
