import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alternative Page",
  description: "Testing alternative page structure",
};

export default function AlternativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ margin: 0, padding: 0, backgroundColor: "white" }}
      >
        {children}
      </body>
    </html>
  );
}
