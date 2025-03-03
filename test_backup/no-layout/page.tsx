"use client";

import { useState } from "react";
import Link from "next/link";

export default function NoLayoutPage() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const pageStyle = {
    backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
    color: theme === "light" ? "#1f2937" : "#ffffff",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "system-ui, sans-serif",
  };

  const cardStyle = {
    backgroundColor: theme === "light" ? "#f3f4f6" : "#374151",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    backgroundColor: theme === "light" ? "#2563eb" : "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "0.25rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    marginRight: "0.5rem",
  };

  return (
    <div style={pageStyle}>
      <header style={{ marginBottom: "2rem" }}>
        <h1
          style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}
        >
          No Layout Page
        </h1>
        <button onClick={toggleTheme} style={buttonStyle}>
          Toggle Theme ({theme})
        </button>
      </header>

      <main>
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            About This Page
          </h2>
          <p style={{ marginBottom: "1rem" }}>
            This page doesn't use a separate layout file and manages its own
            styling.
          </p>
        </div>

        <div style={cardStyle}>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
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
                color: theme === "light" ? "#2563eb" : "#60a5fa",
                textDecoration: "none",
              }}
            >
              Home
            </Link>
            <Link
              href="/test"
              style={{
                color: theme === "light" ? "#2563eb" : "#60a5fa",
                textDecoration: "none",
              }}
            >
              Test Page
            </Link>
            <Link
              href="/alternative"
              style={{
                color: theme === "light" ? "#2563eb" : "#60a5fa",
                textDecoration: "none",
              }}
            >
              Alternative Page
            </Link>
          </nav>
        </div>
      </main>

      <footer
        style={{
          borderTop: `1px solid ${theme === "light" ? "#e5e7eb" : "#4b5563"}`,
          paddingTop: "1rem",
          color: theme === "light" ? "#6b7280" : "#9ca3af",
          fontSize: "0.875rem",
        }}
      >
        This page manages its own theme state.
      </footer>
    </div>
  );
}
