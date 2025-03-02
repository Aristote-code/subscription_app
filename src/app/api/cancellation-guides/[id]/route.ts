import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET handler for fetching a specific cancellation guide
 * @param request Request object
 * @param params Route parameters containing guide ID
 * @returns The requested cancellation guide
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch guide from database
    const guide = await prisma.cancellationGuide.findUnique({
      where: {
        id,
      },
    });

    // Check if guide exists
    if (!guide) {
      return NextResponse.json(
        { success: false, error: "Cancellation guide not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: guide });
  } catch (error) {
    console.error("Error fetching cancellation guide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cancellation guide" },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a cancellation guide
 * @param request Request with updated guide data
 * @param params Route parameters containing guide ID
 * @returns The updated cancellation guide
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if guide exists
    const existingGuide = await prisma.cancellationGuide.findUnique({
      where: {
        id,
      },
    });

    if (!existingGuide) {
      return NextResponse.json(
        { success: false, error: "Cancellation guide not found" },
        { status: 404 }
      );
    }

    // Update guide in database
    const updatedGuide = await prisma.cancellationGuide.update({
      where: {
        id,
      },
      data: body,
    });

    return NextResponse.json({ success: true, data: updatedGuide });
  } catch (error) {
    console.error("Error updating cancellation guide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cancellation guide" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a cancellation guide
 * @param request Request object
 * @param params Route parameters containing guide ID
 * @returns Success message
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if guide exists
    const existingGuide = await prisma.cancellationGuide.findUnique({
      where: {
        id,
      },
    });

    if (!existingGuide) {
      return NextResponse.json(
        { success: false, error: "Cancellation guide not found" },
        { status: 404 }
      );
    }

    // Delete guide from database
    await prisma.cancellationGuide.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cancellation guide deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting cancellation guide:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cancellation guide" },
      { status: 500 }
    );
  }
}
