export interface Subscription {
  id: string;
  serviceName: string;
  startDate: Date;
  endDate: Date;
  trialDuration: number;
  reminderDays: number;
  status: "active" | "ending" | "expired";
  cancellationSteps: string[];
  price?: number;
  billingCycle?: string;
  nextBillingDate?: string;
  category?: string;
  notes?: string;
}
