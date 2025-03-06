"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle,
  ShieldCheck,
  Plus,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  LineChart,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
    <div className="flex min-h-screen flex-col">
      {/* Header Section - Black background with white text */}
      <header className="sticky top-0 z-50 w-full bg-background text-foreground">
        <div className="container mx-auto px-4 md:px-6 flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-6 w-6" />
            <span className="font-bold">TrialGuard</span>
          </div>
          <nav className="hidden md:flex gap-4 sm:gap-6">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:underline"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium hover:underline"
            >
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium hover:underline">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium hover:underline hidden sm:inline-block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground font-bold hover:bg-primary/80 rounded-lg px-5 py-2.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Black background with white text */}
        <section className="container mx-auto px-4 md:px-6 py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Take Control of Your Free Trials
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Stop paying for forgotten subscriptions. Track your free
                  trials and get timely reminders before they end.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/signup"
                  className="bg-primary text-primary-foreground hover:bg-primary/80 font-bold text-lg px-8 py-4 rounded-lg transition-all"
                >
                  Try for Free
                </Link>
              </div>
            </div>
            {/* Login form */}
            <div className="w-full max-w-md mt-10 border rounded-lg shadow-lg p-6 bg-card">
              <h2 className="text-2xl font-bold mb-6">Sign in</h2>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    required
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    required
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                <Button className="w-full" type="submit">
                  Sign in
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - White background with black text */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-white text-black"
          id="features"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose TrialGuard?
              </h2>
              <p className="text-xl md:text-2xl text-gray-600">
                Take control of your subscriptions with these powerful tools.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Card 1 */}
              <div className="flex flex-col items-center bg-black text-white border border-white p-8 rounded-lg h-64 hover:scale-105 transition-transform">
                <div className="mb-6">
                  <Calendar className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Track Subscriptions</h3>
                <p className="text-center">
                  Monitor all your trials in one place with countdowns.
                </p>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center bg-black text-white border border-white p-8 rounded-lg h-64 hover:scale-105 transition-transform">
                <div className="mb-6">
                  <Bell className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Set Reminders</h3>
                <p className="text-center">
                  Get notified before your trials end.
                </p>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col items-center bg-black text-white border border-white p-8 rounded-lg h-64 hover:scale-105 transition-transform">
                <div className="mb-6">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cancel Easily</h3>
                <p className="text-center">
                  Follow simple steps to cancel on time.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="#how-it-works"
                className="text-black hover:underline text-lg font-medium"
              >
                Explore All Features
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section - Black background with white text */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-card text-card-foreground"
          id="how-it-works"
        >
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center mb-12">
              How TrialGuard Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <div className="bg-card text-primary border-2 border-primary rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-3">Add Subscriptions</h3>
                <p className="text-muted-foreground">
                  Track your active trials and recurring subscriptions in one
                  place
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-card text-primary border-2 border-primary rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Get Personalized Alerts
                </h3>
                <p className="text-muted-foreground">
                  Receive notifications before trial periods end
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="bg-card text-primary border-2 border-primary rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-3">Save Money</h3>
                <p className="text-muted-foreground">
                  Cancel unwanted services before they start charging
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Black background with white text */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background text-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex flex-col p-6 bg-card rounded-lg shadow-sm border"
                >
                  <blockquote className="text-lg mb-4 flex-1">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10">
                      <img
                        className="aspect-square h-full w-full"
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

        {/* FAQ Section - Uses theme colors */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-background text-foreground"
          id="faq"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-2xl mx-auto divide-y divide-border">
              {[
                {
                  question: "How does TrialGuard work?",
                  answer:
                    "Add your subscriptions, set reminders, and follow our cancellation guides.",
                },
                {
                  question: "Is my data secure?",
                  answer:
                    "Yes, we use industry-standard encryption to protect your information.",
                },
                {
                  question: "Can I cancel anytime?",
                  answer:
                    "Absolutely, cancel your Pro plan anytime with no hassle.",
                },
                {
                  question: "Do you offer a free version?",
                  answer:
                    "Yes, we offer a free tier with limited features as well as a Pro version with additional benefits.",
                },
                {
                  question: "How do I get support?",
                  answer:
                    "Our support team is available 24/7 via email and chat to assist with any questions.",
                },
              ].map((faq, index) => (
                <div key={index} className="py-4">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left py-2 focus:outline-none"
                  >
                    <span className="font-bold text-lg">{faq.question}</span>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="mt-2 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="#" className="text-foreground hover:underline">
                Still have questions? Contact us
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Uses theme variables */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card text-card-foreground">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Stop Overpaying?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Join thousands who never miss a cancellation deadline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/80 font-bold text-lg px-8 py-4 rounded-lg transition-all"
              >
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4 rounded-lg transition-all"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Black background with white text */}
      <footer className="bg-background text-foreground py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {/* Column 1 - Logo and Tagline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="h-5 w-5 text-foreground" />
                <span className="text-2xl font-bold">TrialGuard</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your subscription guardian
              </p>
            </div>

            {/* Column 2 - Links */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground"
                    href="#features"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground"
                    href="#how-it-works"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground"
                    href="#pricing"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-muted-foreground hover:text-foreground"
                    href="#faq"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Links */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:underline">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 - Copyright */}
            <div>
              <p>© 2023 TrialGuard. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
