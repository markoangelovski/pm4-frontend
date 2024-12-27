"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "../components/LoadingAnimation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (user) {
      setIsLoading(false);
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="">
      {isLoading && <LoadingAnimation />}
      {!isLoading && (
        <>
          <main className="">
            <h1>Welcome to the Home Page</h1>
            <p>Here's some content for logged-in users.</p>
          </main>
          <footer className="">Footer</footer>
        </>
      )}
    </div>
  );
}
