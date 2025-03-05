"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";

/**
 * Subscription data interface
 */
interface Subscription {
  id?: string;
  name: string;
  description?: string;
  url?: string;
  trialStartDate: Date | string;
  trialEndDate: Date | string;
  cost: number;
  billingCycle: string;
  status?: string;
  cancellationUrl?: string;
  notes?: string;
  categoryId?: string;
}

/**
 * Props for SubscriptionForm component
 */
interface SubscriptionFormProps {
  subscription?: Subscription;
  onSubmit: (data: Subscription) => void;
  onCancel: () => void;
}

/**
 * SubscriptionForm component for adding or editing subscriptions
 * @param props Component props
 * @returns Subscription form component
 */
const SubscriptionForm = ({
  subscription,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) => {
  // Default empty subscription
  const defaultSubscription: Subscription = {
    name: "",
    description: "",
    url: "",
    trialStartDate: new Date().toISOString().split("T")[0],
    trialEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    cost: 0,
    billingCycle: "monthly",
    categoryId: "",
  };

  const [formData, setFormData] = useState<Subscription>(
    subscription || defaultSubscription
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories");
          // Use mock data as fallback
          setCategories([
            {
              id: "1",
              name: "Entertainment",
              color: "#3B82F6",
              isDefault: true,
            },
            {
              id: "2",
              name: "Productivity",
              color: "#10B981",
              isDefault: true,
            },
            { id: "3", name: "Shopping", color: "#F59E0B", isDefault: true },
            { id: "4", name: "Finance", color: "#EF4444", isDefault: false },
            {
              id: "5",
              name: "Health & Fitness",
              color: "#8B5CF6",
              isDefault: false,
            },
          ]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Use mock data as fallback
        setCategories([
          { id: "1", name: "Entertainment", color: "#3B82F6", isDefault: true },
          { id: "2", name: "Productivity", color: "#10B981", isDefault: true },
          { id: "3", name: "Shopping", color: "#F59E0B", isDefault: true },
          { id: "4", name: "Finance", color: "#EF4444", isDefault: false },
          {
            id: "5",
            name: "Health & Fitness",
            color: "#8B5CF6",
            isDefault: false,
          },
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Initialize form with subscription data if provided
  useEffect(() => {
    if (subscription) {
      // Format dates for input fields
      const formattedSubscription = {
        ...subscription,
        trialStartDate: new Date(subscription.trialStartDate)
          .toISOString()
          .split("T")[0],
        trialEndDate: new Date(subscription.trialEndDate)
          .toISOString()
          .split("T")[0],
      };
      setFormData(formattedSubscription);
    }
  }, [subscription]);

  /**
   * Handle input change
   */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  /**
   * Validate form data
   */
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }

    if (!formData.trialStartDate) {
      newErrors.trialStartDate = "Trial start date is required";
    }

    if (!formData.trialEndDate) {
      newErrors.trialEndDate = "Trial end date is required";
    } else if (
      new Date(formData.trialEndDate) <= new Date(formData.trialStartDate)
    ) {
      newErrors.trialEndDate = "Trial end date must be after start date";
    }

    if (formData.cost < 0) {
      newErrors.cost = "Cost cannot be negative";
    }

    if (!formData.billingCycle) {
      newErrors.billingCycle = "Billing cycle is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Convert string dates to Date objects for API
      const submissionData = {
        ...formData,
        cost: Number(formData.cost),
      };

      onSubmit(submissionData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Service Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.name ? "border-red-300" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-primary focus:outline-none`}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            value={formData.description || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-gray-700"
          >
            Service URL
          </label>
          <input
            id="url"
            name="url"
            type="url"
            value={formData.url || ""}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="trialStartDate"
              className="block text-sm font-medium text-gray-700"
            >
              Trial Start Date *
            </label>
            <input
              id="trialStartDate"
              name="trialStartDate"
              type="date"
              value={formData.trialStartDate.toString()}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.trialStartDate ? "border-red-300" : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-primary focus:outline-none`}
            />
            {errors.trialStartDate && (
              <p className="mt-1 text-sm text-red-600">
                {errors.trialStartDate}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="trialEndDate"
              className="block text-sm font-medium text-gray-700"
            >
              Trial End Date *
            </label>
            <input
              id="trialEndDate"
              name="trialEndDate"
              type="date"
              value={formData.trialEndDate.toString()}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.trialEndDate ? "border-red-300" : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-primary focus:outline-none`}
            />
            {errors.trialEndDate && (
              <p className="mt-1 text-sm text-red-600">{errors.trialEndDate}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="cost"
              className="block text-sm font-medium text-gray-700"
            >
              Cost *
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="cost"
                name="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={handleChange}
                className={`block w-full rounded-md border ${
                  errors.cost ? "border-red-300" : "border-gray-300"
                } pl-7 pr-12 py-2 focus:border-primary focus:outline-none`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">USD</span>
              </div>
            </div>
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600">{errors.cost}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="billingCycle"
              className="block text-sm font-medium text-gray-700"
            >
              Billing Cycle *
            </label>
            <select
              id="billingCycle"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border ${
                errors.billingCycle ? "border-red-300" : "border-gray-300"
              } px-3 py-2 shadow-sm focus:border-primary focus:outline-none`}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one-time">One-time</option>
            </select>
            {errors.billingCycle && (
              <p className="mt-1 text-sm text-red-600">{errors.billingCycle}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="cancellationUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Cancellation URL
          </label>
          <input
            id="cancellationUrl"
            name="cancellationUrl"
            type="url"
            value={formData.cancellationUrl || ""}
            onChange={handleChange}
            placeholder="https://example.com/cancel"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes || ""}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="categoryId"
            value={formData.categoryId || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded-md bg-zinc-800 border-zinc-700 text-white"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-400 mt-1">
            Categorize your subscription for better organization
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/80 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : subscription?.id
            ? "Update Subscription"
            : "Add Subscription"}
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
