"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { toast } from "sonner";

// Import chart components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

/**
 * Interface for subscription data
 */
interface Subscription {
  id: string;
  name: string;
  price: number;
  billingCycle: string;
  category?: string;
  trialEndDate?: string;
  isActive: boolean;
}

/**
 * Interface for analytics data
 */
interface AnalyticsData {
  totalMonthlySpend: number;
  totalYearlySpend: number;
  subscriptionsByCategory: {
    category: string;
    count: number;
    spend: number;
  }[];
  subscriptionsByBillingCycle: {
    cycle: string;
    count: number;
    spend: number;
  }[];
  upcomingRenewals: {
    name: string;
    date: string;
    price: number;
  }[];
  spendingTrend: {
    month: string;
    spend: number;
  }[];
}

/**
 * Analytics page component
 */
export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [timeframe, setTimeframe] = useState<"monthly" | "yearly">("monthly");

  // Chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  /**
   * Fetch analytics data
   */
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analytics");

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        throw new Error(data.error || "Failed to fetch analytics data");
      }
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );

      // For demo purposes, generate mock data if API fails
      generateMockData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Generate mock data for demo purposes
   */
  const generateMockData = () => {
    const mockData: AnalyticsData = {
      totalMonthlySpend: 87.94,
      totalYearlySpend: 1055.28,
      subscriptionsByCategory: [
        { category: "Entertainment", count: 3, spend: 29.97 },
        { category: "Productivity", count: 2, spend: 19.98 },
        { category: "Cloud Storage", count: 1, spend: 9.99 },
        { category: "Other", count: 2, spend: 28.0 },
      ],
      subscriptionsByBillingCycle: [
        { cycle: "Monthly", count: 5, spend: 67.94 },
        { cycle: "Yearly", count: 2, spend: 20.0 },
        { cycle: "Quarterly", count: 1, spend: 0 },
      ],
      upcomingRenewals: [
        { name: "Netflix", date: "2023-06-15", price: 15.99 },
        { name: "Spotify", date: "2023-06-20", price: 9.99 },
        { name: "Adobe Creative Cloud", date: "2023-07-01", price: 52.99 },
      ],
      spendingTrend: [
        { month: "Jan", spend: 75.99 },
        { month: "Feb", spend: 75.99 },
        { month: "Mar", spend: 85.98 },
        { month: "Apr", spend: 85.98 },
        { month: "May", spend: 87.94 },
        { month: "Jun", spend: 87.94 },
      ],
    };

    setAnalyticsData(mockData);
    toast.info("Using demo data for analytics visualization");
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Initialize data
  useEffect(() => {
    fetchAnalyticsData();
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Subscription Analytics</h1>
            <p className="text-muted-foreground">
              Track and analyze your subscription spending
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Select
              value={timeframe}
              onValueChange={(value) =>
                setTimeframe(value as "monthly" | "yearly")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly View</SelectItem>
                <SelectItem value="yearly">Yearly View</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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
      ) : analyticsData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total {timeframe === "monthly" ? "Monthly" : "Yearly"} Spend
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    timeframe === "monthly"
                      ? analyticsData.totalMonthlySpend
                      : analyticsData.totalYearlySpend
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {timeframe === "monthly"
                    ? `${formatCurrency(
                        analyticsData.totalYearlySpend
                      )} per year`
                    : `${formatCurrency(
                        analyticsData.totalMonthlySpend
                      )} per month`}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.subscriptionsByCategory.reduce(
                    (acc, item) => acc + item.count,
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across {analyticsData.subscriptionsByCategory.length}{" "}
                  categories
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Biggest Category
                </CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.subscriptionsByCategory.sort(
                    (a, b) => b.spend - a.spend
                  )[0]?.category || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(
                    analyticsData.subscriptionsByCategory.sort(
                      (a, b) => b.spend - a.spend
                    )[0]?.spend || 0
                  )}{" "}
                  per month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Renewal
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.upcomingRenewals[0]?.name || "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analyticsData.upcomingRenewals[0]?.date
                    ? formatDate(analyticsData.upcomingRenewals[0].date)
                    : "No upcoming renewals"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="spending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="spending">Spending</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="renewals">Upcoming Renewals</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            {/* Spending Tab */}
            <TabsContent value="spending" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Billing Cycle</CardTitle>
                  <CardDescription>
                    Breakdown of your subscription costs by billing frequency
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={analyticsData.subscriptionsByBillingCycle}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cycle" />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(value)
                          }
                        />
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value as number),
                            "Spend",
                          ]}
                        />
                        <Legend />
                        <Bar
                          dataKey="spend"
                          name="Monthly Spend"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="count"
                          name="Number of Subscriptions"
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>
                    Distribution of your subscription costs across categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={analyticsData.subscriptionsByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="spend"
                          nameKey="category"
                        >
                          {analyticsData.subscriptionsByCategory.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value as number),
                            "Monthly Spend",
                          ]}
                        />
                        <Legend />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Renewals Tab */}
            <TabsContent value="renewals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Renewals</CardTitle>
                  <CardDescription>
                    Your subscription renewals in the next 30 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData.upcomingRenewals.length > 0 ? (
                    <div className="space-y-4">
                      {analyticsData.upcomingRenewals.map((renewal, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b pb-4 last:border-0"
                        >
                          <div>
                            <p className="font-medium">{renewal.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(renewal.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatCurrency(renewal.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No upcoming renewals in the next 30 days
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trends</CardTitle>
                  <CardDescription>
                    Your subscription spending over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={analyticsData.spendingTrend}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                          tickFormatter={(value) =>
                            new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(value)
                          }
                        />
                        <Tooltip
                          formatter={(value) => [
                            formatCurrency(value as number),
                            "Monthly Spend",
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="spend"
                          name="Monthly Spend"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  );
}
