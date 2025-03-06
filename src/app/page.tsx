"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  LineChart,
  ShieldAlert,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Home() {
  // State for FAQ accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Testimonials data
  const testimonials = [
    {
      quote: "TrialGuard saved me from forgotten subscriptions!",
      author: "Sarah K.",
      title: "Design Professional",
      avatar: "/avatars/avatar-1.png",
    },
    {
      quote: "So easy to use and keeps me on track with all my trials.",
      author: "James P.",
      title: "Software Developer",
      avatar: "/avatars/avatar-2.png",
    },
    {
      quote: "Finally, a tool that actually works for managing subscriptions.",
      author: "Emily R.",
      title: "Marketing Manager",
      avatar: "/avatars/avatar-3.png",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      {/* Header Section */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">TrialGuard</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary hidden sm:inline-block"
            >
              Sign in
            </Link>
            <Button asChild className="font-semibold" size="sm">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Clean version without login form */}
        <section className="relative overflow-hidden py-20 md:py-32 border-b border-border">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1),transparent_75%)]"></div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-fade-in">
                  Take Control of Your Free Trials
                </h1>
                <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto animate-fade-in animation-delay-100">
                  Stop paying for forgotten subscriptions. Track your free
                  trials and get timely reminders before they end.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-in animation-delay-200">
                  <Button asChild size="lg" className="font-semibold">
                    <Link href="/signup">Try for Free</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="font-semibold"
                  >
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>

                {/* Hero Image */}
                <div className="mt-12 relative animate-fade-in animation-delay-300">
                  <div className="aspect-video md:aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border">
                    <div className="w-full h-full bg-card/80 p-8 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <ShieldAlert className="h-16 w-16 text-primary" />
                        <p className="text-xl font-medium">Dashboard Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="py-20 md:py-32 bg-card text-card-foreground border-b border-border"
          id="features"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Why Choose TrialGuard?
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Take control of your subscriptions with these powerful tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Feature Card 1 */}
              <div className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-md transition-all hover:shadow-xl hover-lift animate-fade-in animation-delay-100">
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-primary/10 -z-10"></div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Track Subscriptions</h3>
                <p className="text-muted-foreground">
                  Monitor all your trials in one place with countdowns.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-md transition-all hover:shadow-xl hover-lift animate-fade-in animation-delay-200">
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-primary/10 -z-10"></div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Set Reminders</h3>
                <p className="text-muted-foreground">
                  Get notified before your trials end.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-md transition-all hover:shadow-xl hover-lift animate-fade-in animation-delay-300">
                <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-primary/10 -z-10"></div>
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold">Cancel Easily</h3>
                <p className="text-muted-foreground">
                  Follow simple steps to cancel on time.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" className="group">
                <Link href="#how-it-works">
                  Explore All Features
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          className="py-20 md:py-32 border-b border-border relative"
          id="how-it-works"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(var(--primary),0.1),transparent_70%)]"></div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                Process
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                How TrialGuard Works
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Our simple three-step process helps you manage your
                subscriptions effortlessly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-bold text-primary animate-float">
                    1
                  </div>
                  <div className="absolute hidden md:block top-8 left-full h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-primary to-transparent"></div>
                </div>
                <h3 className="mt-6 text-xl font-bold">Add Subscriptions</h3>
                <p className="mt-2 text-muted-foreground">
                  Track your active trials and recurring subscriptions in one
                  place.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-bold text-primary animate-float animation-delay-200">
                    2
                  </div>
                  <div className="absolute hidden md:block top-8 left-full h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-primary to-transparent"></div>
                </div>
                <h3 className="mt-6 text-xl font-bold">
                  Get Personalized Alerts
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Receive notifications before trial periods end.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-background text-xl font-bold text-primary animate-float animation-delay-400">
                  3
                </div>
                <h3 className="mt-6 text-xl font-bold">Save Money</h3>
                <p className="mt-2 text-muted-foreground">
                  Cancel unwanted services before they start charging.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-card text-card-foreground border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                What Our Users Say
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Join thousands of satisfied users who've transformed how they
                manage subscriptions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                    </svg>
                  </div>
                  <blockquote className="text-lg mb-4 flex-1">
                    {testimonial.quote}
                  </blockquote>
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <span className="relative flex shrink-0 overflow-hidden rounded-full h-10 w-10 bg-muted">
                      <img
                        className="aspect-square h-full w-full object-cover"
                        alt={testimonial.author}
                        src={testimonial.avatar}
                      />
                    </span>
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          className="py-20 md:py-32 border-b border-border relative"
          id="faq"
        >
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.1),transparent_75%)]"></div>
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                FAQ
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Find answers to the most common questions about TrialGuard.
              </p>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-border">
              {[
                {
                  question: "How does TrialGuard work?",
                  answer:
                    "Add your subscriptions, set reminders, and follow our cancellation guides. We'll notify you before trials end so you never get charged for services you don't want.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "Yes, we use industry-standard encryption to protect your information. Your data is stored securely and we never share it with third parties.",
                },
                {
                  question: "Can I cancel anytime?",
                  answer:
                    "Absolutely, cancel your Pro plan anytime with no hassle. We don't lock you into long-term contracts.",
                },
                {
                  question: "Do you offer a free version?",
                  answer:
                    "Yes, we offer a free tier with limited features as well as a Pro version with additional benefits. The free version allows you to track up to 5 subscriptions.",
                },
                {
                  question: "How do I get support?",
                  answer:
                    "Our support team is available 24/7 via email and chat to assist with any questions. Premium users get priority support with faster response times.",
                },
              ].map((faq, index) => (
                <div key={index} className="py-6">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left focus:outline-none"
                  >
                    <span
                      className={cn(
                        "font-semibold text-lg",
                        openFaqIndex === index && "text-primary"
                      )}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center transition-colors",
                        openFaqIndex === index
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {openFaqIndex === index ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                  {openFaqIndex === index && (
                    <div className="mt-4 text-muted-foreground animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/contact">Still have questions? Contact us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-32 bg-card text-card-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <div className="mx-auto max-w-3xl">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4 animate-fade-in">
                Ready?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gradient animate-fade-in animation-delay-100">
                Stop Paying for Unwanted Subscriptions
              </h2>
              <p className="mt-4 text-xl text-muted-foreground mb-8 animate-fade-in animation-delay-200">
                Join thousands who never miss a cancellation deadline.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
                <Button asChild size="lg" className="font-semibold hover-lift">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-semibold hover-lift"
                >
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Column 1 - Logo and Tagline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-primary" />
                <span className="text-xl font-bold">TrialGuard</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your subscription guardian
              </p>
            </div>

            {/* Column 2 - Navigation */}
            <div>
              <h3 className="font-semibold mb-3">Navigation</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Legal Links */}
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Contact */}
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <p className="text-sm text-muted-foreground">
                support@trialguard.com
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                © {new Date().getFullYear()} TrialGuard. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
