import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    // Get all cookies
    const cookieStore = cookies();
    const allCookies = Array.from(cookieStore.getAll()).map((c) => c.name);

    // Check for next-auth.session-token
    const nextAuthToken = cookieStore.get("next-auth.session-token")?.value;

    // Check for custom token
    const customToken = cookieStore.get("token")?.value;

    // Get the session
    const session = await getServerSession();

    // Try to decode custom token
    let customPayload = null;
    if (customToken) {
      try {
        customPayload = await verifyToken(customToken);
      } catch (e) {
        console.error("Error decoding custom token:", e);
      }
    }

    return NextResponse.json({
      allCookies,
      nextAuthToken: nextAuthToken
        ? { exists: true, length: nextAuthToken.length }
        : null,
      customToken: customToken
        ? { exists: true, length: customToken.length }
        : null,
      session,
      customPayload,
    });
  } catch (error) {
    console.error("Error debugging token:", error);
    return NextResponse.json({
      error: "Failed to debug token",
      details: error,
    });
  }
}
