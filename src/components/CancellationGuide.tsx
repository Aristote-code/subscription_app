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
 * CancellationGuide component for displaying cancellation instructions
 * @param props Component props
 * @returns Cancellation guide component
 */
const CancellationGuide = ({ guide }: CancellationGuideProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse steps from JSON string
  const parsedSteps = (): string[] => {
    try {
      return JSON.parse(guide.steps);
    } catch (error) {
      console.error("Error parsing steps:", error);
      return [guide.steps];
    }
  };

  const steps = parsedSteps();

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium text-gray-900">
          {guide.serviceName}
        </h3>
        <button className="text-gray-500">
          {isExpanded ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          )}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 border-t">
          <ol className="list-decimal pl-5 space-y-2 mt-3">
            {steps.map((step, index) => (
              <li key={index} className="text-gray-700">
                {step}
              </li>
            ))}
          </ol>

          {guide.url && (
            <div className="mt-4">
              <a
                href={guide.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm flex items-center"
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
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Visit cancellation page
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CancellationGuide;
