import type { Metadata } from "next";
import "../globals.css";
import { SidebarLinks } from "@/components/dashboard/sidebarLinks";

export const metadata: Metadata = {
  title: "Short URL",
  description: "Short URL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en">
      <SidebarLinks>{children}</SidebarLinks>
    </div>
  );
}
