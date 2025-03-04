"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
    <div className="bg-black border border-zinc-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">
          {guide.serviceName}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-zinc-400 hover:text-white"
        >
          {isExpanded ? "Hide Steps" : "View Steps"}
        </button>
      </div>

      {guide.url && (
        <a
          href={guide.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-400 text-sm block mb-2"
        >
          Direct Cancellation Link
        </a>
      )}

      {isExpanded && (
        <div className="mt-4">
          <h4 className="font-medium text-white mb-2">How to Cancel:</h4>
          <ol className="list-decimal list-inside text-zinc-400 space-y-2">
            {Array.isArray(steps) &&
              steps.map((step: string, index: number) => (
                <li key={index} className="pl-2">
                  {step}
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Cancellation Guides
            </h1>
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary/80 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Find Cancellation Instructions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Search for step-by-step guides on how to cancel popular services.
            </p>

            <form onSubmit={handleSearch} className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by service name..."
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/80"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]"></div>
                <p className="mt-2 text-gray-500">Loading guides...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : guides.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No cancellation guides found.</p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      fetchGuides();
                    }}
                    className="mt-2 text-primary hover:text-primary/80"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {guides.map((guide) => (
                  <CancellationGuide key={guide.id} guide={guide} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
