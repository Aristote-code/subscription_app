"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { HomeIcon, ChevronRight } from "lucide-react";

type BreadcrumbSegment = {
  name: string;
  href: string;
};

type BreadcrumbsProps = {
  customSegments?: BreadcrumbSegment[];
};

/**
 * Breadcrumbs component that shows the current path in the application
 * Can use automatic path-based breadcrumbs or custom segments
 */
export function Breadcrumbs({ customSegments }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Skip rendering breadcrumbs on the home page
  if (pathname === "/" && !customSegments) return null;

  // Use custom segments if provided, otherwise generate from pathname
  const segments =
    customSegments ||
    pathname
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

        return { name: label, href };
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
                {segment.name}
              </span>
            ) : (
              <Link
                href={segment.href}
                className="hover:text-foreground transition-colors"
              >
                {segment.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
