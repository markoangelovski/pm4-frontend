"use client";

import { useAuth } from "@/hooks/use-auth";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { isLoading, isError, data } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if ((data?.statusCode === 401 || isError) && pathname !== "/login") {
    const redirectUrl = `/login?cb=${encodeURIComponent(
      pathname + "?" + searchParams
    )}`;
    router.push(redirectUrl);
    return <div>Redirecting...</div>;
  }

  if (!data?.hasErrors && pathname === "/login") {
    router.push("/");
    return <div>Redirecting...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
