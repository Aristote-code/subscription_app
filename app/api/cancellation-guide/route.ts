import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { serviceName } = await request.json();

    if (!serviceName) {
      return NextResponse.json(
        { error: "Service name is required" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that provides exactly 10 detailed, step-by-step instructions for cancelling subscriptions. Number your steps from 1 to 10. Include specific navigation paths, exact button names, URLs, and potential obstacles the user might face.",
              },
              {
                role: "user",
                content: `Please provide exactly 10 steps for cancelling a ${serviceName} subscription. Number your steps from 1 to 10. Include exact navigation paths, button names, and any potential obstacles the user might encounter during the cancellation process. Make the steps very clear and comprehensive.`,
              },
            ],
            temperature: 0.3,
            max_tokens: 1000,
          }),
          signal: controller.signal,
          cache: "no-store",
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq API error:", errorData);
        throw new Error(`Groq API returned ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content returned from Groq API");
      }

      // Extract the cancellation steps
      const lines = content.split("\n").filter((line: string) => line.trim());

      // Try various patterns to extract numbered steps
      let steps: string[] = [];

      // Try extracting numbered lists (1. Step one, 2. Step two)
      const numberedPattern = /^\s*(\d+)\.\s+(.*)/;
      steps = lines
        .filter((line: string) => numberedPattern.test(line))
        .map((line: string) => {
          const match = line.match(numberedPattern);
          return match ? match[2] : null;
        })
        .filter(Boolean) as string[];

      // If no numbered steps found, just return the content split by lines
      if (steps.length === 0) {
        steps = lines;
      }

      // Limit to exactly 10 steps
      if (steps.length > 10) {
        steps = steps.slice(0, 10);
      }

      // If less than 10 steps, add generic ones to fill it out
      while (steps.length < 10) {
        steps.push(
          `Step ${
            steps.length + 1
          }: Continue following any on-screen instructions to complete the cancellation process.`
        );
      }

      return NextResponse.json({ steps });
    } catch (error: unknown) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        return NextResponse.json(
          { error: "Request to Groq API timed out" },
          { status: 408 }
        );
      }

      throw error;
    }
  } catch (error: unknown) {
    console.error("Error generating cancellation steps:", error);
    return NextResponse.json(
      { error: "Failed to generate cancellation steps" },
      { status: 500 }
    );
  }
}
