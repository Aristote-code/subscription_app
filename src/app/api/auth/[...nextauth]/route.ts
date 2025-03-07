import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Log details about the NextAuth configuration
console.log("[NEXTAUTH] Initializing NextAuth with the following options:", {
  providers: authOptions.providers.map((provider) => provider.id),
  session: {
    strategy: authOptions.session?.strategy || "default",
    maxAge: authOptions.session?.maxAge || "30 days",
  },
  pages: authOptions.pages,
});

// Create the handler using our authOptions
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };
