"use client";

import type React from "react";
import { useState } from "react";
import { useUrls } from "@/hooks/useUrls";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LinkIcon, Search } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { UrlTable } from "@/components/dashboard/UrlTable";
import DropdownMenu from "@/components/DropdownMenu";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const urlSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
});

type UrlFormValues = z.infer<typeof urlSchema>;

interface ToastMessage {
  id: string;
  title?: string;
  description: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

// Separate the dashboard content from the provider wrapper
function DashboardContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { urls, isLoading, stats, createUrl, isCreating, copyToClipboard } =
    useUrls();
  console.log(urls, "-----------------------------urls");
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      longUrl: "",
    },
  });

  const showToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const onSubmit = async (values: UrlFormValues) => {
    if (!values.longUrl) return;
    try {
      await createUrl(values.longUrl);
      form.reset();
      setShowCreateModal(false);
      showToast({
        title: "URL shortened successfully",
        description: "Your new short URL is ready to use",
      });
    } catch (error) {
      console.error("Error shortening URL:", error);
      showToast({
        title: "Failed to shorten URL",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSelectUrl = (id: string) => {
    setSelectedUrls((prev) =>
      prev.includes(id) ? prev.filter((urlId) => urlId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUrls(
      selected ? urls?.map((url) => url.id.toString()) || [] : []
    );
    setSelectedUrls(selected ? (urls as any)?.map((url) => url.id) || [] : []);
  };

  return (
    <ProtectedRoute>
      <div className=" bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">
                URL Dashboard
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Manage and track your shortened URLs
              </p>
            </div>
            <DropdownMenu />
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl ring-1 ring-indigo-900/5 p-6">
              <div className="text-sm font-medium text-indigo-600 mb-2">
                Total URLs
              </div>
              <div className="text-2xl font-bold text-indigo-900">
                {stats.totalUrls}
              </div>
              <p className="text-xs text-indigo-500 mt-1">
                {stats.recentUrls.length} created in the last 7 days
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl ring-1 ring-indigo-900/5 p-6">
              <div className="text-sm font-medium text-indigo-600 mb-2">
                Total Clicks
              </div>
              <div className="text-2xl font-bold text-indigo-900">
                {stats.totalClicks}
              </div>
              <p className="text-xs text-indigo-500 mt-1">
                Avg. {Math.round(stats.totalClicks / stats.totalUrls)} clicks
                per URL
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl ring-1 ring-indigo-900/5 p-6">
              <div className="text-sm font-medium text-indigo-600 mb-2">
                Top Performing URL
              </div>
              <div className="text-2xl font-bold text-indigo-900">
                {stats.mostClicked ? stats.mostClicked.clicks : 0} clicks
              </div>
              <p className="text-xs text-indigo-500 mt-1 truncate">
                {stats.mostClicked
                  ? (stats.mostClicked as any).longUrl
                  : "No URLs yet"}
              </p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm py-8 px-6 shadow-xl ring-1 ring-gray-900/5 rounded-xl">
            <h2 className="text-xl font-bold text-gray-900">Shorten a URL</h2>
            <p className="mt-2 text-sm text-gray-600 mb-6">
              Enter a long URL to create a shortened version
            </p>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex justify-between gap-4"
            >
              <Input
                {...form.register("longUrl")}
                placeholder="https://example.com/very/long/url"
                className="flex-1 text-zinc-800"
              />
              <Button
                type="submit"
                disabled={isCreating}
                className="whitespace-nowrap"
              >
                {isCreating ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Shortening...
                  </span>
                ) : (
                  "Shorten URL"
                )}
              </Button>
            </form>
            {form.formState.errors.longUrl && (
              <p className="mt-2 text-sm text-red-500">
                {form.formState.errors.longUrl.message}
              </p>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl ring-1 ring-indigo-900/5">
            <div className="p-6 border-b border-indigo-200/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-indigo-900">
                    Your URLs
                  </h2>
                  <p className="text-sm text-indigo-600">
                    Manage and track all your shortened URLs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative w-full sm:w-[200px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-indigo-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search URLs..."
                      className="w-full pl-10 pr-3 py-2 border border-indigo-300 rounded-lg shadow-sm placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-b border-indigo-200/30">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === "all"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-indigo-500 hover:text-indigo-700"
                  }`}
                >
                  All URLs
                </button>
                <button
                  onClick={() => setActiveTab("top")}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === "top"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-indigo-500 hover:text-indigo-700"
                  }`}
                >
                  Top Performing
                </button>
                <button
                  onClick={() => setActiveTab("recent")}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === "recent"
                      ? "border-b-2 border-indigo-500 text-indigo-600"
                      : "text-indigo-500 hover:text-indigo-700"
                  }`}
                >
                  Recently Created
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* URLs content based on active tab */}
              {activeTab === "all" && (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
                    </div>
                  ) : urls?.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-indigo-200 rounded-lg">
                      <LinkIcon className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                      <p className="text-indigo-600">
                        No URLs yet. Create one above!
                      </p>
                    </div>
                  ) : (
                    <UrlTable
                      urls={urls}
                      selectedUrls={selectedUrls}
                      onSelectUrl={handleSelectUrl}
                      onSelectAll={handleSelectAll}
                      onCopyUrl={copyToClipboard}
                    />
                  )}
                </div>
              )}

              {/* Similar structure for top and recent tabs */}
            </div>
          </div>

          {/* Toast notifications */}
          <div className="fixed bottom-0 right-0 p-6 z-50">
            <div className="space-y-2">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`max-w-md w-full bg-white/80 backdrop-blur-sm shadow-xl rounded-lg pointer-events-auto flex ring-1 ring-indigo-900/5 ${
                    toast.variant === "destructive"
                      ? "border-l-4 border-red-500"
                      : ""
                  }`}
                >
                  {/* Toast content */}
                </div>
              ))}
            </div>
          </div>

          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
              <Card className="w-full max-w-lg p-6">
                <h2 className="text-xl font-semibold text-indigo-900 mb-4">
                  Create new link
                </h2>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Input
                    {...form.register("longUrl")}
                    placeholder="Enter your long URL"
                    className="mb-4"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create link</Button>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default DashboardContent;
