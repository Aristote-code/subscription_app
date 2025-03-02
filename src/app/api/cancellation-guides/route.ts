import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET handler for fetching cancellation guides
 * @param request Request with optional search query
 * @returns List of cancellation guides
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    // If search query is provided, filter guides by service name
    const guides = await prisma.cancellationGuide.findMany({
      where: search
        ? {
            serviceName: {
              contains: search,
            },
          }
        : undefined,
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
    const existingGuide = await prisma.cancellationGuide.findUnique({
      where: {
        serviceName,
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
      data: body,
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
