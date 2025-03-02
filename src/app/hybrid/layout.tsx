import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hybrid Style Test",
  description: "Testing hybrid styles",
};

export default function HybridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0, backgroundColor: "#f3f4f6" }}
      >
        {children}
      </body>
    </html>
  );
}
