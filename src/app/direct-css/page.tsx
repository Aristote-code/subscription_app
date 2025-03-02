"use client";

import Link from "next/link";
import "./styles.css";

export default function DirectCssPage() {
  return (
    <div className="container">
      <div className="header">
        <h1>Direct CSS Test</h1>
      </div>
      <div className="content">
        <p>This page uses direct CSS classes instead of Tailwind.</p>

        <div className="box blue-box">
          This should be a blue box with white text
        </div>
        <div className="box red-box">
          This should be a red box with white text
        </div>
        <div className="box green-box">
          This should be a green box with white text
        </div>

        <Link href="/" className="button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
