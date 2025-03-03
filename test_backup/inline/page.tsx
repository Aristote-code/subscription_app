"use client";

import Link from "next/link";

export default function InlineStylePage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
          }}
        >
          Inline Style Test
        </h1>
      </div>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p>This page uses inline styles only.</p>

        <div
          style={{
            padding: "15px",
            borderRadius: "6px",
            color: "white",
            marginBottom: "10px",
            backgroundColor: "#3b82f6",
          }}
        >
          This should be a blue box with white text
        </div>
        <div
          style={{
            padding: "15px",
            borderRadius: "6px",
            color: "white",
            marginBottom: "10px",
            backgroundColor: "#ef4444",
          }}
        >
          This should be a red box with white text
        </div>
        <div
          style={{
            padding: "15px",
            borderRadius: "6px",
            color: "white",
            marginBottom: "10px",
            backgroundColor: "#10b981",
          }}
        >
          This should be a green box with white text
        </div>

        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#1f2937",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "500",
            marginTop: "20px",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
