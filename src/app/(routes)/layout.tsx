import type { Metadata } from "next";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarRight } from "@/components/sidebar-right";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import localFont from "next/font/local";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Suspense } from "react";

const queryClient = new QueryClient();

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
  title: "Project Manager",
  description: "Manage your projects and tasks",
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
              <SidebarProvider>
                <SidebarLeft />
                <SidebarInset>{children}</SidebarInset>
                <SidebarRight />
              </SidebarProvider>
              <Toaster />
            </AuthProvider>
          </Suspense>
        </TanstackProvider>
      </body>
    </html>
  );
}
