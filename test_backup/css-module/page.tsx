"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function CssModulePage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>CSS Module Test</h1>
      </div>
      <div className={styles.content}>
        <p>This page uses CSS Modules instead of Tailwind.</p>

        <div className={styles.blueBox}>
          This should be a blue box with white text
        </div>
        <div className={styles.redBox}>
          This should be a red box with white text
        </div>
        <div className={styles.greenBox}>
          This should be a green box with white text
        </div>

        <Link href="/" className={styles.button}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
