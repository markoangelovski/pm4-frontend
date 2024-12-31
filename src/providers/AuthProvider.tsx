"use client";

import LoadingAnimation from "@/components/LoadingAnimation";
import { useProfileQuery } from "@/hooks/use-auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLogin = pathname === "/login";
  const isRegister = pathname === "/register";

  const { isSuccess, isPending, isError, error } = useProfileQuery();

  const router = useRouter();

  useEffect(() => {
    // Basic case when not logged in user tries to access a protected page
    if (isError && !isLogin && !isRegister) {
      router.push(`/login?callback=${pathname}&error=${error?.message}`);
    }
    // Case when logged in user tries to access register or login page
    if (isSuccess && (isLogin || isRegister)) {
      router.push(`/`);
    }
  }, [isSuccess, isError, error, router, pathname]);

  // Show loading animation while the profile query is in progress
  if (isPending) return <LoadingAnimation />;

  // If user is not logged in, render the login page
  if (isError && (isLogin || isRegister)) return <>{children}</>;

  // If user is logged in, render the children
  if (!isError) return <>{children}</>;

  // Do not display anything while the profile query is not in progress and user is not logged in, avoids the flash of unauthenticated content
  return null;
}
