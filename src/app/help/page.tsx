"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SearchIcon,
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  FileText,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  Bell,
  FileQuestion,
  Settings,
  MoveRight,
  Play,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/breadcrumbs";

/**
 * Help and Documentation Page
 */
export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /**
   * Updates form field values
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Handles contact form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would send data to an API endpoint
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Your message has been sent!");
      setSubmitted(true);

      // Reset the form
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Filter FAQ items based on search query
   */
  const filterItems = (items: any[], query: string) => {
    if (!query) return items;

    const lowerCaseQuery = query.toLowerCase();

    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(lowerCaseQuery) ||
        item.answer.toLowerCase().includes(lowerCaseQuery)
    );
  };

  // FAQ data
  const faqItems = [
    {
      id: "what-is-trialguard",
      question: "What is TrialGuard?",
      answer:
        "TrialGuard is a subscription management tool that helps you track free trials, set reminders before they end, and avoid unwanted charges from services you no longer use.",
    },
    {
      id: "how-to-add-subscription",
      question: "How do I add a new subscription?",
      answer:
        "From your dashboard, click the 'Add Subscription' button. Fill in the details of your subscription, including the service name, trial start and end dates, cost, and billing cycle. Click 'Save' to add it to your dashboard.",
    },
    {
      id: "setting-up-reminders",
      question: "How do I set up reminders?",
      answer:
        "When adding or editing a subscription, you can set reminders for when the trial is about to end. By default, TrialGuard will remind you 3 days before a trial ends, but you can customize this in your settings.",
    },
    {
      id: "notification-types",
      question: "What types of notifications can I receive?",
      answer:
        "TrialGuard can send you email notifications and in-app notifications. You can choose which types you prefer in your settings.",
    },
    {
      id: "cancellation-guide",
      question: "How do the cancellation guides work?",
      answer:
        "For popular services, TrialGuard provides step-by-step instructions on how to cancel your subscription. You can find these by selecting a subscription and navigating to the 'Cancellation' tab.",
    },
    {
      id: "export-data",
      question: "Can I export my subscription data?",
      answer:
        "Yes, you can export your subscription data as a CSV file from the Settings page. This allows you to back up your data or analyze it in spreadsheet software.",
    },
    {
      id: "managing-account",
      question: "How do I manage my account settings?",
      answer:
        "Click on your profile picture in the top-right corner and select 'Settings'. From there, you can update your personal information, change your password, or delete your account.",
    },
    {
      id: "delete-account",
      question: "How do I delete my account?",
      answer:
        "Go to Settings > Profile, then scroll to the bottom where you'll find the 'Delete Account' button. Please note that account deletion is permanent and will remove all your data.",
    },
  ];

  // Guides data
  const guides = [
    {
      id: "getting-started",
      title: "Getting Started with TrialGuard",
      description:
        "Learn the basics of using TrialGuard to manage your subscriptions",
      icon: <BookOpen className="h-5 w-5" />,
      link: "/help/guides/getting-started",
    },
    {
      id: "managing-subscriptions",
      title: "Managing Your Subscriptions",
      description: "How to add, edit, and delete subscriptions",
      icon: <FileText className="h-5 w-5" />,
      link: "/help/guides/managing-subscriptions",
    },
    {
      id: "reminders",
      title: "Setting Up Reminders",
      description: "Configure reminders to never miss a trial end date",
      icon: <Bell className="h-5 w-5" />,
      link: "/help/guides/reminders",
    },
    {
      id: "cancellation",
      title: "Using Cancellation Guides",
      description: "How to use our guides to cancel subscriptions easily",
      icon: <FileQuestion className="h-5 w-5" />,
      link: "/help/guides/cancellation",
    },
    {
      id: "account-settings",
      title: "Account Settings",
      description: "Manage your profile, notifications, and security",
      icon: <Settings className="h-5 w-5" />,
      link: "/help/guides/account-settings",
    },
    {
      id: "importing",
      title: "Importing & Exporting Data",
      description: "How to import and export your subscription data",
      icon: <MoveRight className="h-5 w-5" />,
      link: "/help/guides/importing-exporting",
    },
  ];

  const filteredFaqs = filterItems(faqItems, searchQuery);

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <Breadcrumbs />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to your questions and get support
        </p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md mx-auto mb-8">
        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for help topics..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="faq" onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="faq" className="flex items-center">
              <HelpCircle className="mr-2 h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              Guides
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>
        </div>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about TrialGuard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p>{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No results found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try searching with different keywords or browse our guides
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Can't find what you're looking for?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => setActiveTab("contact")}
                >
                  Contact our support team
                </Button>
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3"
                  asChild
                >
                  <Link href="#how-to-add-subscription">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Adding Subscriptions</div>
                      <div className="text-sm text-muted-foreground">
                        Learn how to add and track subscriptions
                      </div>
                    </div>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3"
                  asChild
                >
                  <Link href="#setting-up-reminders">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Setting Up Reminders</div>
                      <div className="text-sm text-muted-foreground">
                        Never miss a trial end date again
                      </div>
                    </div>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3"
                  asChild
                >
                  <Link href="#cancellation-guide">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Cancellation Guides</div>
                      <div className="text-sm text-muted-foreground">
                        How to use our cancellation instructions
                      </div>
                    </div>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-3"
                  asChild
                >
                  <Link href="#managing-account">
                    <ChevronRight className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">Account Management</div>
                      <div className="text-sm text-muted-foreground">
                        Update your profile and settings
                      </div>
                    </div>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Guides</CardTitle>
              <CardDescription>
                Step-by-step guides to help you get the most out of TrialGuard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map((guide) => (
                  <Card key={guide.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          {guide.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {guide.title}
                          </CardTitle>
                          <CardDescription>{guide.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="bg-muted/50 p-4 flex justify-end">
                      <Button variant="ghost" className="text-primary" asChild>
                        <Link href={guide.link}>
                          Read Guide
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>
                Watch our video guides for visual instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">
                      Getting Started with TrialGuard
                    </p>
                    <p className="text-sm text-muted-foreground">3:45</p>
                  </div>
                </div>
                <div className="aspect-video rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  <div className="text-center p-4">
                    <Play className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="font-medium">
                      Advanced Subscription Management
                    </p>
                    <p className="text-sm text-muted-foreground">5:12</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline" asChild>
                  <a
                    href="https://youtube.com/trialguard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View All Tutorials
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team for assistance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for contacting us. We'll get back to you within 24
                    hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is your question about?"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Please describe your issue or question in detail"
                      rows={5}
                      value={contactForm.message}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Send us an email directly</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <Mail className="h-12 w-12 text-primary mb-4" />
                <p className="font-medium mb-2">support@trialguard.app</p>
                <p className="text-sm text-muted-foreground mb-4">
                  We usually respond within 24 hours
                </p>
                <Button variant="outline" asChild>
                  <a href="mailto:support@trialguard.app">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>
                  Chat with our support team in real-time
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <p className="font-medium mb-2">Available Monday-Friday</p>
                <p className="text-sm text-muted-foreground mb-4">
                  9:00 AM - 5:00 PM EST
                </p>
                <Button>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Need urgent help?</AlertTitle>
            <AlertDescription>
              For urgent account or billing issues, please email us at{" "}
              <a
                href="mailto:urgent@trialguard.app"
                className="font-medium underline hover:text-primary"
              >
                urgent@trialguard.app
              </a>{" "}
              with "URGENT" in the subject line.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}
