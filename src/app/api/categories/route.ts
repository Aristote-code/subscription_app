import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/**
 * GET handler to retrieve all categories
 */
export async function GET() {
  try {
    // Get session from NextAuth
    const session = await getSession();

    // Check if user is authenticated
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: User not found" },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get all categories and count subscriptions for each category
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { userId },
          { isDefault: true }, // Include default categories
        ],
      },
      include: {
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Format categories to include subscription count
    const formattedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      color: category.color,
      icon: category.icon,
      isDefault: category.isDefault,
      subscriptionCount: category._count.subscriptions,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

/**
 * POST handler to create a new category
 */
export async function POST(request: Request) {
  try {
    // Get session from NextAuth
    const session = await getSession();

    // Check if user is authenticated
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized: Not authenticated" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: User not found" },
        { status: 401 }
      );
    }

    const userId = user.id;
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Check if category with the same name already exists for this user
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: body.name,
        OR: [{ userId }, { isDefault: true }],
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
        description: body.description,
        color: body.color || "#3B82F6", // Default blue color
        icon: body.icon || "tag",
        userId: userId,
        isDefault: false, // User-created categories are not default
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
