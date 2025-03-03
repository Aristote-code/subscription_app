import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CSS Module Test",
  description: "Testing CSS Modules",
};

export default function CssModuleLayout({
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
