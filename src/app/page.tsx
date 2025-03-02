import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TrialGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-cyan-400 transition-colors"
            >
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hover:bg-accent"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="bg-cyan-600 hover:bg-cyan-500">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Never Get{" "}
                    <span className="relative inline-block">
                      Charged
                      <span className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transform translate-y-1"></span>
                    </span>{" "}
                    for Free Trials Again
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TrialGuard helps you track subscriptions, set reminders, and
                    find cancellation instructions - all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="gap-1.5 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-colors"
                  >
                    <Link href="/signup">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Log in</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block rounded-xl bg-gradient-to-br from-primary/20 via-background to-muted p-8 shadow-lg">
                <div className="bg-background/95 backdrop-blur-sm dark:bg-muted/10 rounded-lg p-6 shadow-lg border border-gray-700">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-xl font-bold">Your Subscriptions</h3>
                    <p className="text-sm text-muted-foreground">
                      Track all your active trials in one place
                    </p>
                  </div>
                  {/* Sample subscription cards */}
                  <div className="space-y-3">
                    {[
                      { name: "Netflix", days: 7, cost: 15.99 },
                      { name: "Spotify", days: 3, cost: 9.99 },
                      { name: "Disney+", days: 12, cost: 7.99 },
                    ].map((sub, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 rounded-lg bg-background border border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                      >
                        <div>
                          <div className="font-medium">{sub.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ${sub.cost}/mo
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 text-xs rounded-full ${
                            sub.days <= 3
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : sub.days <= 7
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {sub.days} days left
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
          id="features"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your subscriptions and free
                  trials
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="p-2 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Track Subscriptions</h3>
                <p className="text-muted-foreground text-center">
                  Keep all your subscriptions and free trials in one place with
                  automatic countdowns.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="p-2 rounded-full bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Set Reminders</h3>
                <p className="text-muted-foreground text-center">
                  Get timely email notifications before your free trials end so
                  you never miss a cancellation.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-lg border bg-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200">
                <div className="p-2 rounded-full bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Cancellation Guide</h3>
                <p className="text-muted-foreground text-center">
                  Access step-by-step cancellation instructions for popular
                  services and platforms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-12 md:py-24 lg:py-32" id="how-it-works">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How It Works
                </h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple steps to never get charged for trials you forget to
                  cancel
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white text-lg font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Add Your Subscriptions</h3>
                <p className="text-gray-300 text-center">
                  Enter the name, trial start/end dates, and cost of your
                  subscription.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white text-lg font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Set Reminders</h3>
                <p className="text-gray-300 text-center">
                  Choose when you want to be reminded before your trial ends.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-600 text-white text-lg font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Cancel On Time</h3>
                <p className="text-gray-300 text-center">
                  Follow our step-by-step instructions to cancel before you get
                  charged.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-cyan-600 to-blue-600 text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Start Saving?
                </h2>
                <p className="max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of users who never miss a cancellation
                  deadline.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="gap-1.5 px-6 py-3 hover:bg-white/90 transition-colors"
                >
                  <Link href="/signup">
                    Get Started For Free <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-700 bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TrialGuard. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
