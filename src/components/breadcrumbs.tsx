"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, ChevronRight } from "lucide-react";

/**
 * Breadcrumbs component that shows the current path in the application
 * Automatically generates breadcrumbs based on the current URL path
 */
export function Breadcrumbs() {
  const pathname = usePathname();

  // Skip rendering breadcrumbs on the home page
  if (pathname === "/") return null;

  // Generate breadcrumb segments from the pathname
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      // Convert slug format to title case
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      // Create the href for this segment
      const href = `/${array.slice(0, index + 1).join("/")}`;

      return { label, href };
    });

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 flex text-sm text-muted-foreground"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center hover:text-foreground transition-colors"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {segments.map((segment, index) => (
          <li key={segment.href} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4" />
            {index === segments.length - 1 ? (
              <span aria-current="page" className="font-medium text-foreground">
                {segment.label}
              </span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-foreground transition-colors"
              >
                {segment.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
