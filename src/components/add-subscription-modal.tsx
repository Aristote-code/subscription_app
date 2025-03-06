"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// List of popular subscription services
const POPULAR_SERVICES = [
  "Netflix",
  "Spotify",
  "Amazon Prime",
  "Disney+",
  "Apple Music",
  "YouTube Premium",
  "Hulu",
  "HBO Max",
  "Adobe Creative Cloud",
  "Microsoft 365",
  "Dropbox",
  "AWS",
  "Google One",
  "PlayStation Plus",
  "Xbox Game Pass",
  "Nintendo Switch Online",
  "Audible",
  "Tidal",
  "Twitch",
  "Slack",
];

// Trial durations for common services (in days)
const DEFAULT_TRIAL_PERIODS: Record<string, number> = {
  Netflix: 30,
  Spotify: 30,
  "Amazon Prime": 30,
  "Disney+": 7,
  "Apple Music": 30,
  "YouTube Premium": 30,
  Hulu: 30,
  "HBO Max": 7,
  "Adobe Creative Cloud": 7,
  AWS: 30,
  "Google One": 14,
};

interface NewSubscription {
  serviceName: string;
  trialStartDate: string;
  trialEndDate: string;
  reminderDays: number;
}

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subscription: NewSubscription) => void;
}

export default function AddSubscriptionModal({
  isOpen,
  onClose,
  onAdd,
}: AddSubscriptionModalProps) {
  const [serviceName, setServiceName] = useState("");
  const [customServiceName, setCustomServiceName] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [trialLength, setTrialLength] = useState(14);
  const [useTrialLength, setUseTrialLength] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setServiceName("");
      setCustomServiceName("");
      setStartDate(new Date());
      setEndDate(undefined);
      setTrialLength(14);
      setUseTrialLength(true);
      setReminderDays(3);
    }
  }, [isOpen]);

  // Update the end date when the start date or trial length changes
  useEffect(() => {
    if (startDate && useTrialLength) {
      const newEndDate = new Date(startDate);
      newEndDate.setDate(startDate.getDate() + trialLength);
      setEndDate(newEndDate);
    }
  }, [startDate, trialLength, useTrialLength]);

  // Set trial length when popular service is selected
  useEffect(() => {
    if (serviceName && DEFAULT_TRIAL_PERIODS[serviceName]) {
      setTrialLength(DEFAULT_TRIAL_PERIODS[serviceName]);
    }
  }, [serviceName]);

  const handleSubmit = () => {
    // Validation
    const finalServiceName =
      serviceName === "custom" ? customServiceName : serviceName;

    if (!finalServiceName) {
      toast.error("Please select or enter a service name");
      return;
    }

    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }

    if (!endDate) {
      toast.error("Please select an end date");
      return;
    }

    // Create new subscription object
    const newSubscription: NewSubscription = {
      serviceName: finalServiceName,
      trialStartDate: format(startDate, "yyyy-MM-dd"),
      trialEndDate: format(endDate, "yyyy-MM-dd"),
      reminderDays,
    };

    // Call onAdd with the new subscription
    onAdd(newSubscription);
    toast.success(`Added ${finalServiceName} subscription`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Service selection */}
          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <Select
              value={serviceName}
              onValueChange={(value) => setServiceName(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_SERVICES.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Custom Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom service name */}
          {serviceName === "custom" && (
            <div className="grid gap-2">
              <Label htmlFor="custom-service">Custom Service Name</Label>
              <Input
                id="custom-service"
                value={customServiceName}
                onChange={(e) => setCustomServiceName(e.target.value)}
                placeholder="Enter service name"
              />
            </div>
          )}

          {/* Start date */}
          <div className="grid gap-2">
            <Label>Trial Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Trial length option */}
          <div className="flex items-center space-x-2">
            <Switch
              id="use-trial-length"
              checked={useTrialLength}
              onCheckedChange={setUseTrialLength}
            />
            <Label htmlFor="use-trial-length">
              Set end date using trial length
            </Label>
          </div>

          {/* Trial length */}
          {useTrialLength ? (
            <div className="grid gap-2">
              <Label htmlFor="trial-length">Trial Length (days)</Label>
              <Input
                id="trial-length"
                type="number"
                value={trialLength}
                onChange={(e) => setTrialLength(parseInt(e.target.value) || 0)}
                min="1"
                max="365"
              />
              <p className="text-sm text-muted-foreground">
                Trial ends on: {endDate && format(endDate, "PPP")}
              </p>
            </div>
          ) : (
            /* End date */
            <div className="grid gap-2">
              <Label>Trial End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Reminder days */}
          <div className="grid gap-2">
            <Label htmlFor="reminder">
              Send reminder days before expiration
            </Label>
            <Input
              id="reminder"
              type="number"
              value={reminderDays}
              onChange={(e) => setReminderDays(parseInt(e.target.value) || 0)}
              min="0"
              max="30"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Subscription
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
