import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Overview of all tasks",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
