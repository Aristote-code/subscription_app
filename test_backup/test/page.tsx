import Link from "next/link";

export default function TestPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          maxWidth: "28rem",
          width: "100%",
          backgroundColor: "white",
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "0.5rem",
          padding: "1.5rem",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "1rem",
          }}
        >
          Inline Style Test
        </h1>
        <p
          style={{
            color: "#4b5563",
            marginBottom: "1rem",
          }}
        >
          This page uses inline styles instead of Tailwind classes.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            This should be a blue box with white text
          </div>
          <div
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            This should be a red box with white text
          </div>
          <div
            style={{
              backgroundColor: "#10b981",
              color: "white",
              padding: "1rem",
              borderRadius: "0.25rem",
            }}
          >
            This should be a green box with white text
          </div>
        </div>
        <div style={{ marginTop: "1.5rem" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              backgroundColor: "#1f2937",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              textDecoration: "none",
              transition: "background-color 0.2s",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
