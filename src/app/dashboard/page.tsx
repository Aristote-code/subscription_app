"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddSubscriptionModal from "@/components/add-subscription-modal";
import SubscriptionDetailModal from "@/components/subscription-detail-modal";
import { toast } from "sonner";
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { differenceInDays, parseISO, format } from "date-fns";
import { Breadcrumbs } from "@/components/breadcrumbs";

// Define the Subscription interface
interface Subscription {
  id: string;
  serviceName: string;
  trialStartDate: string;
  trialEndDate: string;
  reminderDays: number;
  status: "active" | "ending-soon" | "expired";
}

export default function Dashboard() {
  // Mock data for subscriptions
  const initialSubscriptions: Subscription[] = [
    {
      id: "sub_1",
      serviceName: "Netflix",
      trialStartDate: "2023-05-10",
      trialEndDate: "2023-06-09",
      reminderDays: 3,
      status: "expired",
    },
    {
      id: "sub_2",
      serviceName: "Spotify",
      trialStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      trialEndDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      reminderDays: 5,
      status: "active",
    },
    {
      id: "sub_3",
      serviceName: "AWS",
      trialStartDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      trialEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      reminderDays: 2,
      status: "ending-soon",
    },
  ];

  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>(initialSubscriptions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("endDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Update subscription statuses based on dates
  useEffect(() => {
    const updatedSubscriptions = subscriptions.map((sub) => {
      const daysRemaining = differenceInDays(
        parseISO(sub.trialEndDate),
        new Date()
      );
      let status: "active" | "ending-soon" | "expired" = "active";

      if (daysRemaining < 0) {
        status = "expired";
      } else if (daysRemaining <= 7) {
        status = "ending-soon";
      }

      return { ...sub, status };
    });

    setSubscriptions(updatedSubscriptions);
  }, []);

  // Calculate days remaining for a subscription
  const getDaysRemaining = (endDate: string) => {
    return differenceInDays(parseISO(endDate), new Date());
  };

  // Determine status color class based on days remaining
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "ending-soon":
        return "bg-yellow-500";
      case "expired":
        return "bg-red-500";
      default:
        return "";
    }
  };

  // Format the status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "ending-soon":
        return "Ending Soon";
      case "expired":
        return "Expired";
      default:
        return "Unknown";
    }
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Sort subscriptions based on selected column and direction
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    if (sortColumn === "serviceName") {
      return sortDirection === "asc"
        ? a.serviceName.localeCompare(b.serviceName)
        : b.serviceName.localeCompare(a.serviceName);
    } else if (sortColumn === "endDate") {
      return sortDirection === "asc"
        ? new Date(a.trialEndDate).getTime() -
            new Date(b.trialEndDate).getTime()
        : new Date(b.trialEndDate).getTime() -
            new Date(a.trialEndDate).getTime();
    } else if (sortColumn === "status") {
      const statusOrder = { active: 0, "ending-soon": 1, expired: 2 };
      return sortDirection === "asc"
        ? statusOrder[a.status] - statusOrder[b.status]
        : statusOrder[b.status] - statusOrder[a.status];
    }
    return 0;
  });

  // Filter subscriptions based on search term and status filter
  const filteredSubscriptions = sortedSubscriptions.filter(
    (sub) =>
      sub.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === "all" || sub.status === statusFilter)
  );

  // Handle adding a new subscription
  const handleAddSubscription = (
    subscription: Omit<Subscription, "id" | "status">
  ) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: `sub_${Date.now()}`,
      status: "active",
    };

    setSubscriptions([...subscriptions, newSubscription]);
    toast.success(
      `Subscription for ${subscription.serviceName} added successfully!`
    );
    setIsAddModalOpen(false);
  };

  // Handle viewing subscription details
  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
  };

  // Handle updating a subscription
  const handleUpdateSubscription = (updatedSubscription: Subscription) => {
    setSubscriptions(
      subscriptions.map((sub) =>
        sub.id === updatedSubscription.id ? updatedSubscription : sub
      )
    );
    setSelectedSubscription(null);
  };

  // Handle deleting a subscription
  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    setSelectedSubscription(null);
    toast.success("Subscription deleted successfully!");
  };

  return (
    <div className="flex flex-col p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Add Subscription
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Track and Manage Your Subscriptions</CardTitle>
          <CardDescription>
            Keep track of all your trial periods and subscriptions in one place
            to avoid unexpected charges.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[160px]">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort("serviceName")}
                  className="cursor-pointer"
                >
                  <div className="flex items-center">
                    Service
                    {sortColumn === "serviceName" && (
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${
                          sortDirection === "desc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-center">Remaining</TableHead>
                <TableHead
                  onClick={() => handleSort("status")}
                  className="cursor-pointer text-center"
                >
                  <div className="flex items-center justify-center">
                    Status
                    {sortColumn === "status" && (
                      <ArrowUpDown
                        className={`ml-2 h-4 w-4 ${
                          sortDirection === "desc" ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No subscriptions found. Add one to get started!
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((subscription) => {
                  const daysRemaining = getDaysRemaining(
                    subscription.trialEndDate
                  );
                  return (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">
                        {subscription.serviceName}
                      </TableCell>
                      <TableCell>
                        {format(
                          parseISO(subscription.trialEndDate),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {daysRemaining > 0
                              ? `${daysRemaining} days`
                              : `${Math.abs(daysRemaining)} days ago`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getStatusClass(subscription.status)}>
                          {getStatusLabel(subscription.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Info className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleViewSubscription(subscription)
                              }
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteSubscription(subscription.id)
                              }
                            >
                              Delete Subscription
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubscription}
      />

      {/* Subscription Detail Modal */}
      {selectedSubscription && (
        <SubscriptionDetailModal
          subscription={selectedSubscription}
          isOpen={!!selectedSubscription}
          onClose={() => setSelectedSubscription(null)}
          onDelete={handleDeleteSubscription}
          onUpdate={handleUpdateSubscription}
        />
      )}
    </div>
  );
}
