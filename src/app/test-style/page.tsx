import React from "react";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="p-8 rounded-lg shadow-lg border border-primary max-w-md w-full bg-card">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Style Test Page
        </h1>
        <p className="mb-4 text-muted-foreground">
          This is a test to see if styles are applied correctly.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-md">
            Primary Box
          </div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
            Secondary Box
          </div>
          <div className="p-4 bg-accent text-accent-foreground rounded-md">
            Accent Box
          </div>
          <div className="p-4 bg-destructive text-destructive-foreground rounded-md">
            Destructive Box
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/80">
            Button
          </button>
          <a
            href="/"
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
          >
            Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
