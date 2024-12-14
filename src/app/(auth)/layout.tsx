import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import TanstackProvider from "@/providers/TanstackProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
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
              {children}
              <Toaster />
            </AuthProvider>
          </Suspense>
        </TanstackProvider>
      </body>
    </html>
  );
}
