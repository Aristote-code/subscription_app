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
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  // State for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Section - Black background with white text */}
      <header className="sticky top-0 z-50 w-full bg-black text-white">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-white" />
            <span className="text-2xl font-bold">TrialGuard</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-base font-medium hover:underline transition-all"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-base font-medium hover:underline transition-all"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-base font-medium hover:underline transition-all"
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="text-base font-medium hover:underline transition-all"
            >
              FAQ
            </Link>
            <Link
              href="/login"
              className="text-base font-medium hover:underline transition-all"
            >
              Log In
            </Link>
          </nav>
          <Button
            asChild
            className="bg-white text-black font-bold hover:bg-gray-200 rounded-lg px-5 py-2.5"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section - Black background with white text */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
          <div className="container px-4 md:px-6 mx-auto max-w-6xl">
            <div className="flex flex-col items-center text-center space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl">
                Never Get Charged for Free Trials Again.
              </h1>
              <p className="text-xl md:text-2xl max-w-2xl text-gray-300">
                Track your subscriptions, set reminders, and cancel with ease –
                all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button
                  asChild
                  className="bg-white text-black hover:bg-gray-200 font-bold text-lg px-8 py-4 rounded-lg transition-all"
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black text-lg px-8 py-4 rounded-lg transition-all"
                >
                  <Link href="/login">Log In</Link>
                </Button>
              </div>

              {/* Subscription mockup */}
              <div className="w-full max-w-md mt-10 border border-white rounded-lg shadow-lg p-6 bg-black">
                <h3 className="text-xl font-bold mb-4">Your Subscriptions</h3>
                <div className="space-y-4">
                  {[
                    { name: "Netflix", cost: "$15.99/mo", days: "7 days left" },
                    { name: "Spotify", cost: "$9.99/mo", days: "3 days left" },
                    { name: "Disney+", cost: "$7.99/mo", days: "12 days left" },
                  ].map((sub, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 rounded-lg border border-gray-700"
                    >
                      <div>
                        <div className="font-medium">{sub.name}</div>
                        <div className="text-sm text-gray-400">{sub.cost}</div>
                      </div>
                      <div className="px-3 py-1 text-sm rounded-full border border-white">
                        {sub.days}
                      </div>
                    </div>
                  ))}
                </div>
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
          className="w-full py-12 md:py-24 lg:py-32 bg-black text-white"
          id="how-it-works"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works.
              </h2>
              <p className="text-xl md:text-2xl text-gray-300">
                Three easy steps to manage your subscriptions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="bg-black text-white border-2 border-white rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Add Subscriptions</h3>
                <p className="text-center text-gray-300">
                  Enter your trial details.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="bg-black text-white border-2 border-white rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Set Reminders</h3>
                <p className="text-center text-gray-300">
                  Choose your notification timing.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="bg-black text-white border-2 border-white rounded-full w-12 h-12 flex items-center justify-center mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Cancel On Time</h3>
                <p className="text-center text-gray-300">
                  Use our guides to cancel easily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section - Black background with white text */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by Thousands.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Testimonial 1 */}
              <div className="bg-white text-black p-6 rounded-lg border border-black">
                <p className="italic mb-4">
                  "TrialGuard saved me from forgotten subscriptions!"
                </p>
                <p className="font-medium">— Sarah K.</p>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white text-black p-6 rounded-lg border border-black">
                <p className="italic mb-4">
                  "So easy to use and keeps me on track."
                </p>
                <p className="font-medium">— James P.</p>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white text-black p-6 rounded-lg border border-black">
                <p className="italic mb-4">
                  "Finally, a tool that works for me."
                </p>
                <p className="font-medium">— Emily R.</p>
              </div>
            </div>

            {/* Social Proof */}
            <div className="text-center mt-12">
              <p className="text-lg mb-4">Works with your favorite services</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-70">
                {["Netflix", "Spotify", "Disney+", "Amazon", "Adobe"].map(
                  (service, i) => (
                    <div key={i} className="font-bold text-xl">
                      {service}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section - Black background with white text */}
        <section
          className="w-full py-12 md:py-24 lg:py-32 bg-black text-white"
          id="faq"
        >
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently Asked Questions.
              </h2>
            </div>

            <div className="max-w-2xl mx-auto divide-y divide-gray-700">
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
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="mt-2 text-gray-300">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="#" className="text-white hover:underline">
                Still have questions? Contact us
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA Section - White background with black text */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white text-black">
          <div className="container px-4 md:px-6 mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Stop Overpaying?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              Join thousands who never miss a cancellation deadline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-black text-white hover:bg-gray-800 font-bold text-lg px-8 py-4 rounded-lg transition-all"
              >
                <Link href="/signup">Get Started for Free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white text-lg px-8 py-4 rounded-lg transition-all"
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Black background with white text */}
      <footer className="bg-black text-white py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Column 1 - Logo and Tagline */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-white" />
                <span className="text-2xl font-bold">TrialGuard</span>
              </div>
              <p className="text-gray-400 mt-2">Your subscription guardian</p>
            </div>

            {/* Column 2 - Links */}
            <div>
              <ul className="space-y-2">
                <li>
                  <Link href="#features" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="hover:underline">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="hover:underline">
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
