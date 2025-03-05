import { Session } from "next-auth";

/**
 * Extended NextAuth Session with user id
 */
export interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string | null;
  };
}

/**
 * Category interface
 */
export interface Category {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  isDefault?: boolean;
  userId?: string | null;
  subscriptionCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Subscription interface
 */
export interface Subscription {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  billingCycle: string;
  startDate: Date;
  endDate?: Date | null;
  trialEndDate?: Date | null;
  autoRenew: boolean;
  userId: string;
  categoryId?: string | null;
  status: string;
  logo?: string | null;
  website?: string | null;
  cancellationUrl?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  category?: Category | null;
}

/**
 * Reminder interface
 */
export interface Reminder {
  id: string;
  subscriptionId: string;
  date: Date;
  sent: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  subscription?: Subscription;
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  userId: string;
}

/**
 * Cancellation guide interface
 */
export interface CancellationGuide {
  id: string;
  serviceName: string;
  steps: string; // JSON string of steps
  url?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * System settings interface
 */
export interface SystemSettings {
  id: string;
  enableEmailNotifications: boolean;
  enableTrialEndReminders: boolean;
  defaultReminderDays: number;
  maxSubscriptionsPerUser: number;
  maintenanceMode: boolean;
}
