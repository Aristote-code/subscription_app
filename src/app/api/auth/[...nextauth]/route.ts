import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Create the handler using our authOptions
const handler = NextAuth(authOptions);

// Export the handler as GET and POST
export { handler as GET, handler as POST };
