type CancellationResponse = {
  steps: string[];
  error?: string;
};

export const getCancellationSteps = async (
  serviceName: string
): Promise<CancellationResponse> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for detailed steps

    const response = await fetch("/api/cancellation-guide", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceName }),
      signal: controller.signal,
      // Ensure we're using cache: 'no-store' for fresh responses
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: `Server returned status: ${response.status}` }));
      throw new Error(errorData.error || `API returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.steps || !Array.isArray(data.steps) || data.steps.length === 0) {
      throw new Error("No valid cancellation steps returned");
    }

    // Process steps to ensure they're properly formatted
    const processedSteps = data.steps
      .map((step: string) => {
        // Clean up any leading/trailing whitespace and ensure proper formatting
        return step.trim().replace(/^\d+\.\s*/, "");
      })
      .filter(Boolean);

    if (processedSteps.length === 0) {
      throw new Error("No valid cancellation steps after processing");
    }

    return { steps: processedSteps };
  } catch (error) {
    console.error("Error fetching cancellation steps:", error);

    // Provide more specific error messages
    let errorMessage = "Failed to fetch cancellation steps";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage =
          "Request timed out while generating detailed cancellation steps. Try again later.";
      } else if (
        error.message.includes("NetworkError") ||
        error.message.includes("Failed to fetch")
      ) {
        errorMessage =
          "Network error while generating cancellation steps. Check your internet connection.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
    }

    return {
      steps: [],
      error: errorMessage,
    };
  }
};
