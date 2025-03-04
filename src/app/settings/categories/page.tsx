"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Edit,
  Plus,
  Save,
  Tag,
  Trash2,
  XCircle,
  CheckCircle,
  FileSpreadsheet,
  CircleHelp,
  TV,
  ShoppingBag,
  Briefcase,
  DollarSign,
  Heart,
  GraduationCap,
  Music,
  Film,
  Gamepad,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * Interface for Category
 */
interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  subscriptionCount: number;
  isDefault?: boolean;
}

/**
 * Categories Management Page
 */
export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#3B82F6", // Default blue color
  });
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Predefined colors for categories
  const categoryColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#14B8A6", // Teal
    "#F97316", // Orange
    "#6366F1", // Indigo
    "#475569", // Slate
  ];

  // Available icons (represented as strings for simplicity)
  const availableIcons = [
    "entertainment",
    "shopping",
    "productivity",
    "finance",
    "health",
    "education",
    "music",
    "video",
    "gaming",
    "other",
  ];

  /**
   * Fetch categories when the component mounts
   */
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch categories from the API
   */
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, use mock data
      const mockCategories: Category[] = [
        {
          id: "1",
          name: "Entertainment",
          description: "Streaming services, movies, etc.",
          color: "#3B82F6",
          icon: "entertainment",
          subscriptionCount: 5,
          isDefault: true,
        },
        {
          id: "2",
          name: "Productivity",
          description: "Tools for work and productivity",
          color: "#10B981",
          icon: "productivity",
          subscriptionCount: 3,
          isDefault: true,
        },
        {
          id: "3",
          name: "Shopping",
          description: "Shopping memberships and services",
          color: "#F59E0B",
          icon: "shopping",
          subscriptionCount: 2,
          isDefault: true,
        },
        {
          id: "4",
          name: "Finance",
          description: "Financial services and tools",
          color: "#EF4444",
          icon: "finance",
          subscriptionCount: 1,
          isDefault: false,
        },
        {
          id: "5",
          name: "Health & Fitness",
          description: "Health and fitness subscriptions",
          color: "#8B5CF6",
          icon: "health",
          subscriptionCount: 0,
          isDefault: false,
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCategories(mockCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle input change for new or edit category
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    isNew = true
  ) => {
    const { name, value } = e.target;
    if (isNew) {
      setNewCategory((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (editCategory) {
      setEditCategory((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  /**
   * Handle color selection
   */
  const handleColorSelect = (color: string, isNew = true) => {
    if (isNew) {
      setNewCategory((prev) => ({
        ...prev,
        color,
      }));
    } else if (editCategory) {
      setEditCategory((prev) => ({
        ...prev!,
        color,
      }));
    }
  };

  /**
   * Add a new category
   */
  const addCategory = async () => {
    if (!newCategory.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      // In a real app, this would be an API call
      const newId = Math.random().toString(36).substring(2, 9);
      const createdCategory: Category = {
        id: newId,
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
        icon: "other",
        subscriptionCount: 0,
        isDefault: false,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCategories((prev) => [...prev, createdCategory]);
      setNewCategory({
        name: "",
        description: "",
        color: "#3B82F6",
      });
      setShowDialog(false);
      toast.success("Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    }
  };

  /**
   * Start editing a category
   */
  const startEditCategory = (category: Category) => {
    setEditCategory(category);
    setShowDialog(true);
  };

  /**
   * Update an existing category
   */
  const updateCategory = async () => {
    if (!editCategory || !editCategory.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editCategory.id ? { ...editCategory } : cat
        )
      );
      setEditCategory(null);
      setShowDialog(false);
      toast.success("Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  /**
   * Confirm delete a category
   */
  const confirmDeleteCategory = (categoryId: string) => {
    setDeletingCategory(categoryId);
    setShowDeleteDialog(true);
  };

  /**
   * Delete a category
   */
  const deleteCategory = async () => {
    if (!deletingCategory) return;

    try {
      // In a real app, this would be an API call
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const categoryToDelete = categories.find(
        (cat) => cat.id === deletingCategory
      );

      if (
        categoryToDelete?.subscriptionCount &&
        categoryToDelete.subscriptionCount > 0
      ) {
        toast.error(
          `This category has ${categoryToDelete.subscriptionCount} subscriptions. Please reassign them first.`
        );
        return;
      }

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== deletingCategory)
      );
      setDeletingCategory(null);
      setShowDeleteDialog(false);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  /**
   * Export categories to CSV
   */
  const exportCategories = () => {
    try {
      // Create CSV content
      const csvContent = [
        ["ID", "Name", "Description", "Color", "Icon", "Subscription Count"],
        ...categories.map((cat) => [
          cat.id,
          cat.name,
          cat.description || "",
          cat.color || "",
          cat.icon || "",
          cat.subscriptionCount.toString(),
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "trialguard_categories.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Categories exported successfully");
    } catch (error) {
      console.error("Error exporting categories:", error);
      toast.error("Failed to export categories");
    }
  };

  /**
   * Icon component helper
   */
  const IconForCategory = ({ icon }: { icon?: string }) => {
    switch (icon) {
      case "entertainment":
        return <TV className="h-4 w-4" />;
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />;
      case "productivity":
        return <Briefcase className="h-4 w-4" />;
      case "finance":
        return <DollarSign className="h-4 w-4" />;
      case "health":
        return <Heart className="h-4 w-4" />;
      case "education":
        return <GraduationCap className="h-4 w-4" />;
      case "music":
        return <Music className="h-4 w-4" />;
      case "video":
        return <Film className="h-4 w-4" />;
      case "gaming":
        return <Gamepad className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="flex items-center gap-2 mb-8">
        <Button variant="ghost" asChild className="p-0 h-auto">
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Settings
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Categories</h1>
          <p className="text-muted-foreground">
            Manage categories for your subscriptions
          </p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" onClick={exportCategories}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => {
              setEditCategory(null);
              setShowDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Categories Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Create categories to organize your subscriptions and get better
              insights into your spending.
            </p>
            <Button
              onClick={() => {
                setEditCategory(null);
                setShowDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Alert className="mb-6">
            <CircleHelp className="h-4 w-4" />
            <AlertTitle>Categories Help</AlertTitle>
            <AlertDescription>
              Categories help you organize your subscriptions. You can assign a
              category when adding or editing a subscription. Default categories
              cannot be deleted.
            </AlertDescription>
          </Alert>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Subscriptions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                          {category.isDefault && (
                            <Badge variant="outline" className="ml-2">
                              Default
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description || "No description"}
                      </TableCell>
                      <TableCell className="text-right">
                        {category.subscriptionCount}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => startEditCategory(category)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={
                              category.isDefault ||
                              category.subscriptionCount > 0
                            }
                            onClick={() => confirmDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {/* Add/Edit Category Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editCategory
                ? "Update the details for this category"
                : "Create a new category for organizing your subscriptions"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Category Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={editCategory ? editCategory.name : newCategory.name}
                onChange={(e) => handleInputChange(e, !editCategory)}
                placeholder="e.g., Entertainment, Productivity"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={
                  editCategory
                    ? editCategory.description || ""
                    : newCategory.description
                }
                onChange={(e) => handleInputChange(e, !editCategory)}
                placeholder="What kind of subscriptions belong in this category?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Category Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {categoryColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 ${
                      (editCategory
                        ? editCategory.color
                        : newCategory.color) === color
                        ? "border-black dark:border-white"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color, !editCategory)}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialog(false);
                setEditCategory(null);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={editCategory ? updateCategory : addCategory}>
              <Save className="h-4 w-4 mr-2" />
              {editCategory ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingCategory(null);
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteCategory}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
