"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("userData");
      const accessToken = sessionStorage.getItem("accessToken");
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (
        !isLoading &&
        !isAuthenticated &&
        !userData &&
        !accessToken &&
        !refreshToken
      ) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // Allow render if authenticated or if storage has valid data
  const hasStorageData =
    localStorage.getItem("userData") || sessionStorage.getItem("accessToken");
  if (!isAuthenticated && !hasStorageData) {
    return null;
  }

  return <>{children}</>;
}
