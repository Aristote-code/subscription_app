"use client";

import { useState } from "react";
import Link from "next/link";

export default function AlternativePage() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1
        style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
      >
        Alternative Page Structure
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Counter Example
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            Current count: <strong>{count}</strong>
          </p>
          <button
            onClick={() => setCount(count + 1)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Increment
          </button>
        </div>

        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f3f4f6",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            Navigation
          </h2>
          <nav
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Link
              href="/"
              style={{
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
            <Link
              href="/test"
              style={{
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              Test Page
            </Link>
            <Link
              href="/basic"
              style={{
                color: "#2563eb",
                textDecoration: "none",
              }}
            >
              Basic Page
            </Link>
          </nav>
        </div>
      </div>

      <footer
        style={{
          borderTop: "1px solid #e5e7eb",
          paddingTop: "1rem",
          color: "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        This is a test page with a completely different structure.
      </footer>
    </div>
  );
}
