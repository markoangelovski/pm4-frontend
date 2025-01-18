import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import TopBar from "@/components/pm/common/top-bar";
import Sidebar from "@/components/pm/common/sidebar";
import { Suspense } from "react";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "/",
  description: "The most awesome project manager ever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackProvider>
          <Suspense fallback={<div>Suspending...</div>}>
            <AuthProvider>
              <div className="flex flex-col h-screen">
                <TopBar />
                <div className="flex flex-1 overflow-hidden">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
              </div>
            </AuthProvider>
          </Suspense>
        </TanstackProvider>
        <Toaster />
      </body>
    </html>
  );
}
