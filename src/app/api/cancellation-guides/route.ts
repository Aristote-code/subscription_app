import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserId } from "@/utils/auth";

/**
 * GET handler for fetching cancellation guides
 * @param request Request with optional search query
 * @returns List of cancellation guides
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const service = searchParams.get("service");

    // Build the where clause based on search parameters
    let whereClause = {};

    if (search) {
      whereClause = {
        serviceName: {
          contains: search,
          mode: "insensitive",
        },
      };
    } else if (service) {
      whereClause = {
        serviceName: service,
      };
    }

    // If search query is provided, filter guides by service name
    const guides = await prisma.cancellationGuide.findMany({
      where: whereClause,
      orderBy: {
        serviceName: "asc",
      },
    });

    return NextResponse.json({ success: true, data: guides });
  } catch (error) {
    console.error("Error fetching cancellation guides:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cancellation guides" },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new cancellation guide
 * @param request Request with cancellation guide data
 * @returns The created cancellation guide
 */
export async function POST(request: Request) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { serviceName, steps } = body;

    if (!serviceName || !steps) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if guide already exists
    const existingGuide = await prisma.cancellationGuide.findFirst({
      where: {
        serviceName: {
          equals: serviceName,
          mode: "insensitive",
        },
      },
    });

    if (existingGuide) {
      return NextResponse.json(
        {
          success: false,
          error: "Cancellation guide already exists for this service",
        },
        { status: 409 }
      );
    }

    // Create guide in database
    const guide = await prisma.cancellationGuide.create({
      data: {
        serviceName,
        steps: typeof steps === "string" ? steps : JSON.stringify(steps),
        url: body.url,
      },
    });

    return NextResponse.json({ success: true, data: guide }, { status: 201 });
  } catch (error) {
    console.error("Error creating cancellation guide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create cancellation guide" },
      { status: 500 }
    );
  }
}
