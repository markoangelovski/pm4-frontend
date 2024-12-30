"use client";

import LoadingAnimation from "@/components/LoadingAnimation";
import { useProfileQuery } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isPending, isError, error } = useProfileQuery();
  const router = useRouter();

  useEffect(() => {
    if (isError) {
      const currentPath = window.location.pathname;
      router.push(`/login?callback=${currentPath}&error=${error?.message}`);
    }
  }, [isError, error, router]);

  if (isPending) return <LoadingAnimation />;

  return <>{children}</>;
}
