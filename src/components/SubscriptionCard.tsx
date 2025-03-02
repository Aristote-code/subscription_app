"use client";

import { useState } from "react";

/**
 * Subscription data interface
 */
interface Subscription {
  id: string;
  name: string;
  description?: string;
  trialStartDate: Date;
  trialEndDate: Date;
  cost: number;
  billingCycle: string;
  status: string;
  cancellationUrl?: string;
}

/**
 * Props for SubscriptionCard component
 */
interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * SubscriptionCard component for displaying a single subscription
 * @param props Component props
 * @returns Subscription card component
 */
const SubscriptionCard = ({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Format date to readable string
   */
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  /**
   * Calculate days remaining until trial end
   */
  const getDaysRemaining = () => {
    const today = new Date();
    const endDate = new Date(subscription.trialEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  /**
   * Get status badge class based on subscription status
   */
  const getStatusBadgeClass = () => {
    const daysRemaining = getDaysRemaining();

    if (subscription.status === "ended") return "bg-gray-100 text-gray-800";
    if (subscription.status === "cancelled") return "bg-blue-100 text-blue-800";
    if (daysRemaining <= 3) return "bg-red-100 text-red-800";
    if (daysRemaining <= 7) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(subscription.id);
  };

  /**
   * Handle delete button click
   */
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      onDelete(subscription.id);
    }
  };

  const daysRemaining = getDaysRemaining();
  const statusClass = getStatusBadgeClass();

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-4 cursor-pointer">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {subscription.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Trial ends: {formatDate(subscription.trialEndDate)}
            </p>
          </div>
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}
          >
            {subscription.status === "active"
              ? daysRemaining > 0
                ? `${daysRemaining} days left`
                : "Trial ended"
              : subscription.status}
          </span>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t">
            {subscription.description && (
              <p className="text-sm text-gray-600 mb-3">
                {subscription.description}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Trial period</p>
                <p>
                  {formatDate(subscription.trialStartDate)} -{" "}
                  {formatDate(subscription.trialEndDate)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Cost</p>
                <p>
                  ${subscription.cost.toFixed(2)}/{subscription.billingCycle}
                </p>
              </div>
            </div>

            {subscription.cancellationUrl && (
              <div className="mt-3">
                <p className="text-gray-500 text-sm">Cancellation URL</p>
                <a
                  href={subscription.cancellationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 text-sm break-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  {subscription.cancellationUrl}
                </a>
              </div>
            )}

            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm text-primary hover:text-primary/80 border border-primary hover:bg-primary/5 rounded-md"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-600 hover:bg-red-50 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionCard;
