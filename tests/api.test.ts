import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "../src/app/api/subscriptions/route";
import { prisma } from "../src/lib/prisma";

// Mock Prisma client
vi.mock("../src/lib/prisma", () => ({
  prisma: {
    subscription: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    reminder: {
      create: vi.fn(),
    },
  },
}));

describe("Subscriptions API", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.resetAllMocks();
  });

  describe("GET /api/subscriptions", () => {
    it("returns subscriptions for the user", async () => {
      // Mock data
      const mockSubscriptions = [
        {
          id: "1",
          name: "Netflix",
          trialStartDate: new Date("2023-03-01"),
          trialEndDate: new Date("2023-03-30"),
          cost: 15.99,
          billingCycle: "monthly",
          status: "active",
          userId: "mock-user-id",
          reminders: [],
        },
      ];

      // Mock Prisma response
      (prisma.subscription.findMany as any).mockResolvedValue(
        mockSubscriptions
      );

      // Create request
      const request = new NextRequest(
        "http://localhost:3000/api/subscriptions"
      );

      // Call the handler
      const response = await GET(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockSubscriptions);
      expect(prisma.subscription.findMany).toHaveBeenCalledWith({
        where: { userId: "mock-user-id" },
        include: { reminders: true },
        orderBy: { trialEndDate: "asc" },
      });
    });

    it("handles errors gracefully", async () => {
      // Mock Prisma error
      (prisma.subscription.findMany as any).mockRejectedValue(
        new Error("Database error")
      );

      // Create request
      const request = new NextRequest(
        "http://localhost:3000/api/subscriptions"
      );

      // Call the handler
      const response = await GET(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to fetch subscriptions");
    });
  });

  describe("POST /api/subscriptions", () => {
    it("creates a new subscription", async () => {
      // Mock data
      const mockSubscription = {
        id: "1",
        name: "Netflix",
        trialStartDate: new Date("2023-03-01"),
        trialEndDate: new Date("2023-03-30"),
        cost: 15.99,
        billingCycle: "monthly",
        status: "active",
        userId: "mock-user-id",
      };

      // Mock request body
      const requestBody = {
        name: "Netflix",
        trialStartDate: "2023-03-01",
        trialEndDate: "2023-03-30",
        cost: 15.99,
        billingCycle: "monthly",
      };

      // Mock Prisma responses
      (prisma.subscription.create as any).mockResolvedValue(mockSubscription);
      (prisma.reminder.create as any).mockResolvedValue({
        id: "reminder-1",
        date: new Date("2023-03-25"),
        sent: false,
        subscriptionId: "1",
      });

      // Create request
      const request = new NextRequest(
        "http://localhost:3000/api/subscriptions",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Call the handler
      const response = await POST(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockSubscription);
      expect(prisma.subscription.create).toHaveBeenCalledWith({
        data: {
          ...requestBody,
          userId: "mock-user-id",
          status: "active",
        },
      });
      expect(prisma.reminder.create).toHaveBeenCalled();
    });

    it("validates required fields", async () => {
      // Mock request with missing fields
      const requestBody = {
        name: "Netflix",
        // Missing required fields
      };

      // Create request
      const request = new NextRequest(
        "http://localhost:3000/api/subscriptions",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Call the handler
      const response = await POST(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Missing required fields");
      expect(prisma.subscription.create).not.toHaveBeenCalled();
    });

    it("handles errors gracefully", async () => {
      // Mock request body
      const requestBody = {
        name: "Netflix",
        trialStartDate: "2023-03-01",
        trialEndDate: "2023-03-30",
        cost: 15.99,
        billingCycle: "monthly",
      };

      // Mock Prisma error
      (prisma.subscription.create as any).mockRejectedValue(
        new Error("Database error")
      );

      // Create request
      const request = new NextRequest(
        "http://localhost:3000/api/subscriptions",
        {
          method: "POST",
          body: JSON.stringify(requestBody),
        }
      );

      // Call the handler
      const response = await POST(request);
      const data = await response.json();

      // Assertions
      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Failed to create subscription");
    });
  });
});
