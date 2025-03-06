import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define paths that are always public
const publicPaths = ["/", "/login", "/signup", "/api/auth/(.*)"];

// Define paths that require admin role
const adminPaths = ["/admin", "/admin/(.*)", "/api/admin/(.*)"];

// Function to check if a path matches any pattern in an array
const matchesPath = (path: string, patterns: string[]): boolean => {
  return patterns.some((pattern) => {
    if (pattern.includes("(.*)")) {
      const base = pattern.replace("(.*)", "");
      return path === base || path.startsWith(`${base}/`);
    }
    return path === pattern;
  });
};

/**
 * Middleware to handle authentication and routing
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (matchesPath(pathname, publicPaths)) {
    return NextResponse.next();
  }

  // Check for authentication token
  const token = await getToken({ req: request });

  // If not authenticated and not on a public path, redirect to login
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  // Handle admin-only paths
  if (matchesPath(pathname, adminPaths)) {
    // Check if user has admin role
    const userRole = token.role as string;

    if (userRole !== "ADMIN") {
      // Redirect non-admin users to dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // User is authenticated and has appropriate role - allow access
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    // All paths except static files, favicon and _next
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
