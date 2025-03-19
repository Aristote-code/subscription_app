import { Metadata } from "next";
import { Inter } from "next/font/google";
import "../src/index.css";
import "../src/App.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subscription Manager",
  description:
    "Manage your subscription trials and get reminders before they end",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
