import React, { useState } from "react";
import { differenceInDays, format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Edit,
  Eye,
  Trash,
  XCircle,
} from "lucide-react";
import AddSubscriptionModal from "./AddSubscriptionModal";
import { SubscriptionDetailsModal } from "./SubscriptionDetailsModal";
import { Subscription } from "@/types/subscription";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onAddSubscription: (subscription: Subscription) => void;
  onUpdateSubscription: (
    id: string,
    subscription: Partial<Subscription>
  ) => void;
  onDeleteSubscription: (id: string) => void;
}

const SubscriptionTable = ({
  subscriptions,
  onAddSubscription,
  onUpdateSubscription,
  onDeleteSubscription,
}: SubscriptionTableProps) => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [activeTab, setActiveTab] = useState("view");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    return differenceInDays(endDate, today);
  };

  const getStatus = (endDate: Date) => {
    const daysLeft = getDaysRemaining(endDate);
    if (daysLeft < 0) return "expired";
    if (daysLeft <= 5) return "ending";
    return "active";
  };

  const getStatusBadge = (status: "active" | "ending" | "expired") => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center">
            <span className="status-badge status-active">
              <CheckCircle className="h-3 w-3 mr-1 inline" />
              Active
            </span>
          </div>
        );
      case "ending":
        return (
          <div className="flex items-center">
            <span className="status-badge status-ending">
              <AlertCircle className="h-3 w-3 mr-1 inline" />
              Ending Soon
            </span>
          </div>
        );
      case "expired":
        return (
          <div className="flex items-center">
            <span className="status-badge status-expired">
              <XCircle className="h-3 w-3 mr-1 inline" />
              Expired
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const handleOpenModal = (subscription: Subscription, tab: string) => {
    try {
      setSelectedSubscription(subscription);
      setActiveTab(tab);
      setDetailsModalOpen(true);
    } catch (error) {
      console.error("Error opening modal:", error);
      toast({
        title: "Error",
        description:
          "Something went wrong when opening the modal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSubscription = (updatedSubscription: Subscription) => {
    try {
      onUpdateSubscription(updatedSubscription.id, updatedSubscription);

      toast({
        title: "Success",
        description: `Subscription for ${updatedSubscription.serviceName} updated.`,
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = (id: string, serviceName: string) => {
    setSubscriptionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (subscriptionToDelete) {
      onDeleteSubscription(subscriptionToDelete);
      setDeleteDialogOpen(false);
      setSubscriptionToDelete(null);

      toast({
        title: "Subscription Deleted",
        description: "The subscription has been removed.",
      });
    }
  };

  const updateSubscriptionStatuses = () => {
    // Update status based on days remaining
    subscriptions.forEach((subscription) => {
      const newStatus = getStatus(subscription.endDate);
      if (subscription.status !== newStatus) {
        onUpdateSubscription(subscription.id, { status: newStatus });
      }
    });
  };

  // Update statuses on render
  React.useEffect(() => {
    updateSubscriptionStatuses();
  }, [subscriptions]);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Your Subscriptions</h2>
          <p className="text-sm text-muted-foreground">
            Manage your free trials and subscriptions
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>Add Subscription</Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg border-border">
          <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No subscriptions yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add your first subscription to start tracking free trials.
          </p>
          <Button onClick={() => setAddModalOpen(true)}>
            Add Subscription
          </Button>
        </div>
      ) : (
        <div className="rounded-md border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((subscription) => {
                const daysRemaining = getDaysRemaining(subscription.endDate);

                return (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.serviceName}
                    </TableCell>
                    <TableCell>
                      {format(subscription.startDate, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(subscription.endDate, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {daysRemaining > 0
                        ? `${daysRemaining} days left`
                        : "Expired"}
                    </TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenModal(subscription, "view")}
                      >
                        <span className="sr-only">View details</span>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleOpenModal(subscription, "edit")}
                      >
                        <span className="sr-only">Edit subscription</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-primary"
                        onClick={() =>
                          handleOpenModal(subscription, "cancellation")
                        }
                      >
                        <span className="sr-only">Cancel subscription</span>
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() =>
                          handleDeleteClick(
                            subscription.id,
                            subscription.serviceName
                          )
                        }
                      >
                        <span className="sr-only">Delete subscription</span>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Subscription Modal */}
      <AddSubscriptionModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onAddSubscription={onAddSubscription}
      />

      {/* Subscription Details Modal with Tabs */}
      {selectedSubscription && (
        <SubscriptionDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          subscription={selectedSubscription}
          onUpdate={handleUpdateSubscription}
          onDelete={onDeleteSubscription}
          activeTab={activeTab}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="modal-transition">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this subscription and its reminders.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SubscriptionTable;
