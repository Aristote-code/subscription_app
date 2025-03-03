"use client";

import Link from "next/link";

export default function HybridStylePage() {
  return (
    <div
      className="max-w-4xl mx-auto p-5"
      style={{ fontFamily: "system-ui, sans-serif" }}
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
        <h1 className="text-2xl font-bold m-0">Hybrid Style Test</h1>
      </div>
      <div className="bg-white p-5 rounded-lg shadow">
        <p className="mb-4">
          This page uses a combination of Tailwind classes and inline styles.
        </p>

        <div
          className="p-4 rounded mb-3"
          style={{ backgroundColor: "#3b82f6", color: "white" }}
        >
          This should be a blue box with white text
        </div>
        <div
          className="p-4 rounded mb-3"
          style={{ backgroundColor: "#ef4444", color: "white" }}
        >
          This should be a red box with white text
        </div>
        <div
          className="p-4 rounded mb-3"
          style={{ backgroundColor: "#10b981", color: "white" }}
        >
          This should be a green box with white text
        </div>

        <Link
          href="/"
          className="inline-block mt-5 rounded"
          style={{
            backgroundColor: "#1f2937",
            color: "white",
            padding: "10px 20px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
