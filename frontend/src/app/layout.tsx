import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import ReactQueryClientProvider from "../components/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "URL Shortener",
  description: "A modern URL shortener application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
