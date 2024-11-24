"use client";

import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { isLoading, isError, data, error } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  // Handle errors with API call
  if (isError && pathname !== "/login") {
    let redirectUrl = `/login?cb=${encodeURIComponent(
      `${pathname}?${searchParams}`
    )}&error=${encodeURIComponent(
      error?.message || data?.message || "An error ocurred!"
    )}`;

    router.push(redirectUrl);
    return <div>Redirecting...</div>;
  }

  // Handle unauthorized access and redirect to login page
  if (data && data?.statusCode >= 400 && pathname !== "/login") {
    let redirectUrl = `/login?cb=${encodeURIComponent(
      `${pathname}?${searchParams}`
    )}`;

    const withError = error?.message || data?.message;

    if (withError)
      redirectUrl = redirectUrl + `&error=${encodeURIComponent(withError)}`;

    router.push(redirectUrl);
    return <div>Redirecting...</div>;
  }

  // Handle redirect to homepage if user is authenticated and the pathname is /login
  if (data && !data?.hasErrors && pathname === "/login") {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
