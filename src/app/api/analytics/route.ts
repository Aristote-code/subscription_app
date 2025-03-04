import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

/**
 * GET /api/analytics
 * Get analytics data for user subscriptions
 */
export async function GET() {
  try {
    // Get user ID from session token
    const cookieStore = cookies();
    const token = await getToken({
      req: { cookies: cookieStore } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Check if user is authenticated
    if (!token || !token.sub) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = token.sub;

    // Get all active subscriptions for the user
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        billingCycle: true,
        category: true,
        trialEndDate: true,
        nextBillingDate: true,
      },
    });

    // Calculate total monthly spend
    let totalMonthlySpend = 0;

    // Group subscriptions by category
    const categoryMap = new Map<string, { count: number; spend: number }>();

    // Group subscriptions by billing cycle
    const billingCycleMap = new Map<string, { count: number; spend: number }>();

    // Get upcoming renewals
    const upcomingRenewals: { name: string; date: string; price: number }[] =
      [];

    // Process each subscription
    subscriptions.forEach((sub) => {
      // Calculate monthly cost based on billing cycle
      let monthlyCost = sub.price;

      if (sub.billingCycle === "YEARLY") {
        monthlyCost = sub.price / 12;
      } else if (sub.billingCycle === "QUARTERLY") {
        monthlyCost = sub.price / 3;
      } else if (sub.billingCycle === "WEEKLY") {
        monthlyCost = sub.price * 4.33; // Average weeks in a month
      } else if (sub.billingCycle === "BIWEEKLY") {
        monthlyCost = sub.price * 2.17; // Average bi-weeks in a month
      }

      totalMonthlySpend += monthlyCost;

      // Add to category map
      const category = sub.category || "Uncategorized";
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, spend: 0 });
      }
      const categoryData = categoryMap.get(category)!;
      categoryData.count += 1;
      categoryData.spend += monthlyCost;

      // Add to billing cycle map
      const cycle = formatBillingCycle(sub.billingCycle);
      if (!billingCycleMap.has(cycle)) {
        billingCycleMap.set(cycle, { count: 0, spend: 0 });
      }
      const cycleData = billingCycleMap.get(cycle)!;
      cycleData.count += 1;
      cycleData.spend += monthlyCost;

      // Check if this is an upcoming renewal (next 30 days)
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setDate(today.getDate() + 30);

      // Use nextBillingDate if available, otherwise use trialEndDate
      const renewalDate = sub.nextBillingDate || sub.trialEndDate;

      if (renewalDate && renewalDate > today && renewalDate <= nextMonth) {
        upcomingRenewals.push({
          name: sub.name,
          date: renewalDate.toISOString(),
          price: sub.price,
        });
      }
    });

    // Sort upcoming renewals by date
    upcomingRenewals.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    // Generate spending trend (mock data for now)
    // In a real app, this would come from historical subscription data
    const spendingTrend = generateSpendingTrend(totalMonthlySpend);

    // Format data for response
    const analyticsData = {
      totalMonthlySpend: parseFloat(totalMonthlySpend.toFixed(2)),
      totalYearlySpend: parseFloat((totalMonthlySpend * 12).toFixed(2)),
      subscriptionsByCategory: Array.from(categoryMap.entries()).map(
        ([category, data]) => ({
          category,
          count: data.count,
          spend: parseFloat(data.spend.toFixed(2)),
        })
      ),
      subscriptionsByBillingCycle: Array.from(billingCycleMap.entries()).map(
        ([cycle, data]) => ({
          cycle,
          count: data.count,
          spend: parseFloat(data.spend.toFixed(2)),
        })
      ),
      upcomingRenewals,
      spendingTrend,
    };

    // Return analytics data
    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

/**
 * Format billing cycle for display
 */
function formatBillingCycle(cycle: string): string {
  const cycleMap: Record<string, string> = {
    MONTHLY: "Monthly",
    YEARLY: "Yearly",
    QUARTERLY: "Quarterly",
    WEEKLY: "Weekly",
    BIWEEKLY: "Bi-weekly",
  };

  return cycleMap[cycle] || cycle;
}

/**
 * Generate mock spending trend data
 * In a real app, this would come from historical subscription data
 */
function generateSpendingTrend(
  currentMonthlySpend: number
): { month: string; spend: number }[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const trend: { month: string; spend: number }[] = [];

  // Generate some variation in historical spending
  let previousSpend = currentMonthlySpend * 0.85; // Start at 85% of current spend

  for (let i = 0; i < months.length; i++) {
    // Add some random variation (between -5% and +8%)
    const variation = previousSpend * (Math.random() * 0.13 - 0.05);

    // For the last month, use the exact current spend
    const spend =
      i === months.length - 1 ? currentMonthlySpend : previousSpend + variation;

    trend.push({
      month: months[i],
      spend: parseFloat(spend.toFixed(2)),
    });

    previousSpend = spend;
  }

  return trend;
}
