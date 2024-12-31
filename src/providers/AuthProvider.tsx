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
  const { isPending, isError, error } = useProfileQuery();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isError && pathname !== "/login") {
      router.push(`/login?callback=${pathname}&error=${error?.message}`);
    }
  }, [isError, error, router, pathname]);

  // Show loading animation while the profile query is in progress
  if (isPending) return <LoadingAnimation />;

  // If user is not logged in, render the login page
  if (isError && pathname === "/login") return <>{children}</>;

  // If user is logged in, render the children
  if (!isError) return <>{children}</>;

  // Do not display anything while the profile query is not in progress and user is not logged in, avoids the flash of unauthenticated content
  return null;
}
