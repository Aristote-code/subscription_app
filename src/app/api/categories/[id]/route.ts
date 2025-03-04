import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getToken } from "@/lib/auth";

/**
 * GET handler to retrieve a specific category
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    // Check if token exists
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const payload = getToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.id;

    // Get the category and count its subscriptions
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    // Check if category exists
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if user has access to this category
    if (!category.isDefault && category.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: Access denied to this category" },
        { status: 403 }
      );
    }

    // Format category to include subscription count
    const formattedCategory = {
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      isDefault: category.isDefault,
      userId: category.userId,
      subscriptionCount: category._count.subscriptions,
    };

    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler to update a category
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    // Check if token exists
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const payload = getToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.id;
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Find the category to update
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    // Check if category exists
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if user has access to update this category
    if (category.isDefault) {
      return NextResponse.json(
        { error: "Default categories cannot be modified" },
        { status: 403 }
      );
    }

    if (category.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: Access denied to this category" },
        { status: 403 }
      );
    }

    // Check if another category with the same name already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: body.name,
        id: { not: categoryId },
        OR: [{ userId }, { isDefault: true }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        name: body.name,
        description: body.description,
        color: body.color,
        icon: body.icon,
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    // Format updated category to include subscription count
    const formattedCategory = {
      id: updatedCategory.id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      color: updatedCategory.color,
      icon: updatedCategory.icon,
      isDefault: updatedCategory.isDefault,
      userId: updatedCategory.userId,
      subscriptionCount: updatedCategory._count.subscriptions,
    };

    return NextResponse.json(formattedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler to remove a category
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = params.id;

    // Get token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    // Check if token exists
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: No token provided" },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const payload = getToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = payload.id;

    // Find the category to delete
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    // Check if category exists
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if user has access to delete this category
    if (category.isDefault) {
      return NextResponse.json(
        { error: "Default categories cannot be deleted" },
        { status: 403 }
      );
    }

    if (category.userId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized: Access denied to this category" },
        { status: 403 }
      );
    }

    // Check if category has subscriptions
    if (category._count.subscriptions > 0) {
      return NextResponse.json(
        {
          error:
            "This category has subscriptions. Please reassign them before deleting.",
          subscriptionCount: category._count.subscriptions,
        },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
