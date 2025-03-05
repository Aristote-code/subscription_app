"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

// List of popular subscription services
const POPULAR_SERVICES = [
  "Netflix",
  "Spotify",
  "Disney+",
  "Amazon Prime",
  "YouTube Premium",
  "Apple Music",
  "Hulu",
  "HBO Max",
  "Adobe Creative Cloud",
  "Microsoft 365",
  "Google One",
  "Dropbox",
  "PlayStation Plus",
  "Xbox Game Pass",
  "Nintendo Switch Online",
  "Slack",
  "Zoom",
  "GitHub",
  "Notion",
  "Canva Pro",
  "Audible",
  "Grammarly",
  "Headspace",
  "Peloton",
  "Calm",
  "Duolingo Plus",
  "Twitch",
  "ESPN+",
  "Paramount+",
  "Apple TV+",
  "Apple Arcade",
  "Apple News+",
  "Starz",
  "Showtime",
  "Tidal",
  "Deezer",
  "Evernote",
  "LastPass",
  "1Password",
  "NordVPN",
  "ExpressVPN",
  "Surfshark",
  "Dashlane",
  "McAfee",
  "Norton",
  "Avast",
  "Bitdefender",
  "ProtonMail",
  "LinkedIn Premium",
].sort();

interface AddSubscriptionFormProps {
  isDialog?: boolean;
}

export function AddSubscriptionForm({
  isDialog = false,
}: AddSubscriptionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    trialStartDate: new Date(),
    trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default to 30 days from now
    cost: "",
    billingCycle: "monthly",
    cancellationUrl: "",
  });
  const [customService, setCustomService] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    if (!formData.name) {
      toast.error("Please enter a subscription name");
      setIsSubmitting(false);
      return;
    }

    if (!formData.cost) {
      toast.error("Please enter the subscription cost");
      setIsSubmitting(false);
      return;
    }

    // Prepare data for API
    const subscriptionData = {
      ...formData,
      cost: parseFloat(formData.cost.toString()),
      trialStartDate: formData.trialStartDate.toISOString(),
      trialEndDate: formData.trialEndDate.toISOString(),
    };

    try {
      // API call to save the subscription
      const response = await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subscriptionData),
      });

      if (!response.ok) {
        throw new Error("Failed to add subscription");
      }

      toast.success("Subscription added successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        trialStartDate: new Date(),
        trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cost: "",
        billingCycle: "monthly",
        cancellationUrl: "",
      });
      setCustomService(false);

      // If in a dialog, no need to navigate
      if (!isDialog) {
        router.push("/dashboard");
      }

      // Refresh the dashboard data
      router.refresh();
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast.error("Failed to add subscription. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Service Name</Label>
          {customService ? (
            <div className="flex gap-2">
              <Input
                id="name"
                placeholder="Enter custom service name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setCustomService(false)}
                className="whitespace-nowrap"
              >
                Use List
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Select
                value={formData.name}
                onValueChange={(value) => handleInputChange("name", value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {POPULAR_SERVICES.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCustomService(true)}
                className="whitespace-nowrap"
              >
                Custom
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="Add details about this subscription"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className="resize-none"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Trial Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.trialStartDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.trialStartDate ? (
                    format(formData.trialStartDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.trialStartDate}
                  onSelect={(date) =>
                    handleInputChange("trialStartDate", date || new Date())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Trial End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.trialEndDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.trialEndDate ? (
                    format(formData.trialEndDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.trialEndDate}
                  onSelect={(date) =>
                    handleInputChange("trialEndDate", date || new Date())
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-7"
                value={formData.cost}
                onChange={(e) => handleInputChange("cost", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select
              value={formData.billingCycle}
              onValueChange={(value) =>
                handleInputChange("billingCycle", value)
              }
            >
              <SelectTrigger id="billingCycle">
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cancellationUrl">Cancellation URL (Optional)</Label>
          <Input
            id="cancellationUrl"
            type="url"
            placeholder="https://example.com/cancel"
            value={formData.cancellationUrl}
            onChange={(e) =>
              handleInputChange("cancellationUrl", e.target.value)
            }
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        {isDialog ? (
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="default"
          className="bg-zinc-800 hover:bg-zinc-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </>
          )}
        </Button>
      </div>
    </form>
  );

  // If used as a dialog, return just the form content
  if (isDialog) {
    return formContent;
  }

  // If used as a standalone page, wrap in a card
  return (
    <div className="mx-auto max-w-2xl py-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="bg-black border-zinc-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold">
            Add New Subscription
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Track a new subscription or free trial
          </CardDescription>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    </div>
  );
}
