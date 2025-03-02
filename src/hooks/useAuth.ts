"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid credentials");
        return false;
      }

      toast.success("Logged in successfully");
      router.push("/dashboard");
      router.refresh();
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
      return false;
    }
  };

  const socialLogin = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
      return true;
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error("Something went wrong with social login. Please try again.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong. Please try again.");
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register");
      }

      toast.success("Account created successfully");
      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
      return false;
    }
  };

  return {
    session,
    user: session?.user,
    isLoading,
    isAuthenticated,
    login,
    socialLogin,
    logout,
    register,
  };
}
