"use client";

import { useState } from "react";

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
 * Props for CancellationGuide component
 */
interface CancellationGuideProps {
  guide: CancellationGuideData;
}

/**
 * Component for displaying cancellation guide information
 */
export default function CancellationGuide({ guide }: CancellationGuideProps) {
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
