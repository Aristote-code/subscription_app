"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export default function SupportPage() {
  const [supportCategory, setSupportCategory] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportCategory || !supportMessage) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Support request submitted successfully");
    setSupportCategory("");
    setSupportMessage("");
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8">
      <h1 className="text-2xl font-bold">Contact Support</h1>

      <Card className="bg-black border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Submit a Request</CardTitle>
          <CardDescription className="text-zinc-400">
            Fill out the form below to get help from our support team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitSupport} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={supportCategory}
                onValueChange={setSupportCategory}
              >
                <SelectTrigger
                  id="category"
                  className="bg-zinc-900 border-zinc-800 text-white"
                >
                  <SelectValue placeholder="Select issue category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="billing">Billing Problems</SelectItem>
                  <SelectItem value="subscriptions">
                    Subscription Tracking
                  </SelectItem>
                  <SelectItem value="reminders">Reminder Issues</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue in detail"
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className="min-h-32 bg-zinc-900 border-zinc-800 text-white"
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-none shadow-none"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="bg-black text-white">
          <AccordionItem value="item-1" className="border-zinc-800">
            <AccordionTrigger className="hover:bg-zinc-900 px-4">
              How do I add a new subscription?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-zinc-400">
              To add a new subscription, click the "Add new subscription" button
              in the top-right corner of the dashboard. Fill in the subscription
              details including name, trial start and end dates, cost, and
              billing cycle.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="border-zinc-800">
            <AccordionTrigger className="hover:bg-zinc-900 px-4">
              How do reminders work?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-zinc-400">
              TrialGuard automatically sends you reminders before your trial
              periods end. You can customize how many days in advance you want
              to be notified in your settings page. Reminders can be sent via
              email or SMS depending on your preferences.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-zinc-800">
            <AccordionTrigger className="hover:bg-zinc-900 px-4">
              How do I cancel a subscription?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-zinc-400">
              Click on the "Details" button for any subscription on your
              dashboard. Then, navigate to the "Cancel" tab where you'll find
              step-by-step instructions for canceling that specific service
              along with direct links to the cancellation page when available.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-zinc-800">
            <AccordionTrigger className="hover:bg-zinc-900 px-4">
              Can I edit subscription details?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-zinc-400">
              Yes, you can edit any subscription by clicking on "Details" and
              then navigating to the "Edit" tab. From there, you can update all
              subscription details including name, cost, dates, and billing
              cycle.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="border-zinc-800">
            <AccordionTrigger className="hover:bg-zinc-900 px-4">
              Is my data secure?
            </AccordionTrigger>
            <AccordionContent className="px-4 text-zinc-400">
              Yes, TrialGuard takes data security seriously. All your
              subscription data is encrypted and stored securely. We never share
              your information with third parties or subscription services. Your
              data is only used to provide you with the subscription tracking
              and reminder services.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Card className="bg-black border-zinc-800 text-white">
        <CardHeader>
          <CardTitle>Direct Contact</CardTitle>
          <CardDescription className="text-zinc-400">
            If you prefer, you can reach us directly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="flex items-center space-x-2">
              <span className="font-medium">Email:</span>
              <span className="text-zinc-400">support@trialguard.com</span>
            </p>
            <p className="flex items-center space-x-2">
              <span className="font-medium">Phone:</span>
              <span className="text-zinc-400">+1 (555) 123-4567</span>
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              Our support team is available Monday through Friday, 9 AM to 5 PM
              EST.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
