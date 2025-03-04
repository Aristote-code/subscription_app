"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  ArrowLeft,
  UserCog,
  Settings,
  Shield,
  Users,
  AlertTriangle,
} from "lucide-react";

/**
 * Interface for user data
 */
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  subscriptionCount: number;
}

/**
 * Interface for system settings
 */
interface SystemSettings {
  enableEmailNotifications: boolean;
  enableTrialEndReminders: boolean;
  defaultReminderDays: number;
  maxSubscriptionsPerUser: number;
  maintenanceMode: boolean;
}

/**
 * Admin dashboard page
 */
export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    enableEmailNotifications: true,
    enableTrialEndReminders: true,
    defaultReminderDays: 3,
    maxSubscriptionsPerUser: 50,
    maintenanceMode: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  /**
   * Fetch users data
   */
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/users");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch users");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );

      // For demo purposes, generate mock data if API fails
      generateMockUsers();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetch system settings
   */
  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setSettings(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch settings");
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
      // Keep default settings
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Save system settings
   */
  const saveSettings = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Settings saved successfully");
      } else {
        throw new Error(data.error || "Failed to save settings");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Toggle user admin status
   */
  const toggleUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAdmin }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isAdmin } : user
          )
        );
        toast.success(
          `User ${isAdmin ? "promoted to admin" : "demoted from admin"}`
        );
      } else {
        throw new Error(data.error || "Failed to update user");
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error("Failed to update user");
    }
  };

  /**
   * Delete user
   */
  const deleteUser = async () => {
    if (!selectedUser) return;

    if (deleteConfirmation !== selectedUser.email) {
      setError("Please type the user's email to confirm deletion");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local state
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        setDeleteConfirmation("");
        toast.success("User deleted successfully");
      } else {
        throw new Error(data.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to delete user");
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Generate mock users for demo
   */
  const generateMockUsers = () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        isAdmin: true,
        createdAt: "2023-01-15T00:00:00.000Z",
        subscriptionCount: 8,
      },
      {
        id: "2",
        name: "John Doe",
        email: "john@example.com",
        isAdmin: false,
        createdAt: "2023-02-20T00:00:00.000Z",
        subscriptionCount: 5,
      },
      {
        id: "3",
        name: "Jane Smith",
        email: "jane@example.com",
        isAdmin: false,
        createdAt: "2023-03-10T00:00:00.000Z",
        subscriptionCount: 3,
      },
      {
        id: "4",
        name: "Bob Johnson",
        email: "bob@example.com",
        isAdmin: false,
        createdAt: "2023-04-05T00:00:00.000Z",
        subscriptionCount: 7,
      },
      {
        id: "5",
        name: "Alice Williams",
        email: "alice@example.com",
        isAdmin: false,
        createdAt: "2023-05-12T00:00:00.000Z",
        subscriptionCount: 2,
      },
    ];

    setUsers(mockUsers);
    toast.info("Using demo data for admin dashboard");
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Initialize data
  useEffect(() => {
    fetchUsers();
    fetchSettings();
  }, []);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="mb-2 gap-1 pl-0 text-muted-foreground"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Manage users and system settings
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-red-500">{error}</div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Subscriptions</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell>{user.subscriptionCount}</TableCell>
                          <TableCell>
                            <Switch
                              checked={user.isAdmin}
                              onCheckedChange={(checked) =>
                                toggleUserAdmin(user.id, checked)
                              }
                              aria-label="Toggle admin status"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure global application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Enable email notifications for all users
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableEmailNotifications: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="trial-reminders">
                        Trial End Reminders
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Send reminders when trial periods are ending
                      </p>
                    </div>
                    <Switch
                      id="trial-reminders"
                      checked={settings.enableTrialEndReminders}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableTrialEndReminders: checked,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reminder-days">Default Reminder Days</Label>
                    <p className="text-sm text-muted-foreground">
                      Days before trial end to send reminder
                    </p>
                    <Input
                      id="reminder-days"
                      type="number"
                      min={1}
                      max={30}
                      value={settings.defaultReminderDays}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultReminderDays: parseInt(e.target.value) || 3,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-subscriptions">
                      Max Subscriptions Per User
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Maximum number of subscriptions a user can create
                    </p>
                    <Input
                      id="max-subscriptions"
                      type="number"
                      min={1}
                      max={100}
                      value={settings.maxSubscriptionsPerUser}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxSubscriptionsPerUser:
                            parseInt(e.target.value) || 50,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="space-y-0.5">
                      <Label
                        htmlFor="maintenance-mode"
                        className="text-red-500 font-medium"
                      >
                        Maintenance Mode
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Put the application in maintenance mode
                      </p>
                    </div>
                    <Switch
                      id="maintenance-mode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, maintenanceMode: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={saveSettings} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Settings"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              This action is permanent and cannot be undone. All user data,
              including subscriptions and settings, will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="font-medium">User details:</p>
              <p>Name: {selectedUser?.name}</p>
              <p>Email: {selectedUser?.email}</p>
              <p>Subscriptions: {selectedUser?.subscriptionCount}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                Type <span className="font-medium">{selectedUser?.email}</span>{" "}
                to confirm:
              </Label>
              <Input
                id="confirm-email"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                className="border-red-300"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
                setDeleteConfirmation("");
                setError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteUser}
              disabled={isSaving || deleteConfirmation !== selectedUser?.email}
            >
              {isSaving ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
