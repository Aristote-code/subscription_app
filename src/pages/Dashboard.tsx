import React, { useState, useEffect } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import SubscriptionTable from "@/components/dashboard/SubscriptionTable";
import { Subscription } from "@/types/subscription";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const Dashboard = () => {
  // State for subscriptions
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Load subscriptions from localStorage on initial render
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem("subscriptions");
    if (savedSubscriptions) {
      try {
        // Convert string dates back to Date objects
        const parsedSubscriptions = JSON.parse(savedSubscriptions).map(
          (sub: any) => ({
            ...sub,
            startDate: new Date(sub.startDate),
            endDate: new Date(sub.endDate),
          })
        );
        setSubscriptions(parsedSubscriptions);
      } catch (error) {
        console.error("Error parsing subscriptions from localStorage:", error);
        // Initialize with empty array if there's an error
        setSubscriptions([]);
      }
    }
  }, []);

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));
  }, [subscriptions]);

  // Filter subscriptions based on search term and status filter
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch = subscription.serviceName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (statusFilter === "all") {
      return matchesSearch;
    }

    return matchesSearch && subscription.status === statusFilter;
  });

  // Handlers for CRUD operations
  const handleAddSubscription = (subscription: Subscription) => {
    setSubscriptions((prev) => [...prev, subscription]);

    toast({
      title: "Subscription Added",
      description: `You'll be reminded ${subscription.reminderDays} days before the trial ends.`,
    });
  };

  const handleUpdateSubscription = (
    id: string,
    updates: Partial<Subscription>
  ) => {
    setSubscriptions((prev) =>
      prev.map((subscription) =>
        subscription.id === id ? { ...subscription, ...updates } : subscription
      )
    );
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.filter((subscription) => subscription.id !== id)
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 px-6 py-24 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="page-transition space-y-8">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subscriptions..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="ending">Ending Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subscription Table */}
            <SubscriptionTable
              subscriptions={filteredSubscriptions}
              onAddSubscription={handleAddSubscription}
              onUpdateSubscription={handleUpdateSubscription}
              onDeleteSubscription={handleDeleteSubscription}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
