"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ExternalLink, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * Interface for cancellation guide data
 */
interface CancellationGuideData {
  id: string;
  serviceName: string;
  steps: string;
  url?: string;
}

/**
 * CancellationGuide component for displaying guide information
 */
function CancellationGuide({ guide }: { guide: CancellationGuideData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const steps =
    typeof guide.steps === "string" ? JSON.parse(guide.steps) : guide.steps;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>{guide.serviceName}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            <span className="ml-2">{isExpanded ? "Hide" : "Show"} steps</span>
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <ol className="space-y-3 mb-4">
            {steps.map((step: string, index: number) => (
              <li key={index} className="flex items-start">
                <Badge className="h-6 w-6 rounded-full mr-3 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          {guide.url && (
            <div className="mt-4">
              <Button variant="outline" asChild>
                <a
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit cancellation page
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * CancellationGuidesPage component for browsing cancellation guides
 */
export default function CancellationGuidesPage() {
  const [guides, setGuides] = useState<CancellationGuideData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch cancellation guides from API
   */
  const fetchGuides = async (search?: string) => {
    setIsLoading(true);
    setError("");

    try {
      const url = search
        ? `/api/cancellation-guides?search=${encodeURIComponent(search)}`
        : "/api/cancellation-guides";

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch cancellation guides");
      }

      setGuides(data.data);
    } catch (err) {
      console.error("Error fetching guides:", err);
      setError("Failed to load cancellation guides. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch guides on initial load
  useEffect(() => {
    fetchGuides();
  }, []);

  /**
   * Handle search form submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGuides(searchQuery);
  };

  return (
    <div className="container max-w-4xl py-8 px-4">
      <Breadcrumbs />
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cancellation Guides</h1>
        <p className="text-muted-foreground mt-1">
          Step-by-step instructions for cancelling popular services
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for a service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>

      {/* Guides section */}
      <div className="mt-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-red-500">{error}</p>
            </CardContent>
          </Card>
        ) : guides.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground">
                No guides found for your search.
              </p>
              <Button
                variant="link"
                onClick={() => fetchGuides()}
                className="mt-2"
              >
                View all guides
              </Button>
            </CardContent>
          </Card>
        ) : (
          guides.map((guide) => (
            <CancellationGuide key={guide.id} guide={guide} />
          ))
        )}
      </div>
    </div>
  );
}
