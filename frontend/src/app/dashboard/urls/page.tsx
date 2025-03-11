"use client";

import { useState, useMemo } from "react";
import { useUrls } from "@/hooks/useUrls";
import { Search, Calendar, LinkIcon, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UrlTable } from "@/components/dashboard/UrlTable";

type FilterPeriod = "7days" | "30days" | "90days" | "all";

export default function UrlsPage() {
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { urls, isLoading: isLoadingUrls, copyToClipboard } = useUrls();

  // Filter URLs based on search query and time period
  const filteredUrls = useMemo(() => {
    if (!urls) return [];

    let filtered = [...urls];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (url) =>
          url.longUrl.toLowerCase().includes(query) ||
          url.shortUrl.toLowerCase().includes(query)
      );
    }

    // Apply time period filter
    if (filterPeriod !== "all") {
      const now = new Date();
      const periods = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
      };
      const days = periods[filterPeriod];
      const cutoffDate = new Date(now.setDate(now.getDate() - days));

      filtered = filtered.filter(
        (url) => new Date(url.createdAt) >= cutoffDate
      );
    }

    return filtered;
  }, [urls, searchQuery, filterPeriod]);

  const handleSelectUrl = (id: string) => {
    setSelectedUrls((prev) =>
      prev.includes(id) ? prev.filter((urlId) => urlId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedUrls(selected ? filteredUrls?.map((url) => url.id) || [] : []);
  };

  const filterOptions = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "all", label: "All time" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm">
            Your URLs
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            View and manage all your shortened links in one place
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm py-6 px-6 shadow-xl ring-1 ring-gray-900/5 rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search URLs..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Button
                  variant="secondary"
                  className="flex items-center gap-2"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <Calendar className="h-4 w-4" />
                  {
                    filterOptions.find((opt) => opt.value === filterPeriod)
                      ?.label
                  }
                  <ChevronDown className="h-4 w-4" />
                </Button>

                {showFilterDropdown && (
                  <div className="absolute z-50 right-0 mt-2 w-48 bg-white/80 backdrop-blur-sm rounded-lg shadow-xl ring-1 ring-gray-900/5 ">
                    <div className="py-1">
                      {filterOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`block w-full px-4 py-2 text-sm text-left z-50 ${
                            filterPeriod === option.value
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-gray-700 hover:bg-indigo-50"
                          }`}
                          onClick={() => {
                            setFilterPeriod(option.value as FilterPeriod);
                            setShowFilterDropdown(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedUrls.length > 0 && (
                <Button variant="primary">
                  Selected ({selectedUrls.length})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* URLs Table */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl ring-1 ring-gray-900/5 rounded-xl overflow-hidden z-20">
          {isLoadingUrls ? (
            <div className="flex justify-center py-12">
              <svg
                className="animate-spin h-8 w-8 text-indigo-600"
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
            </div>
          ) : filteredUrls.length === 0 ? (
            <div className="text-center py-12">
              <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || filterPeriod !== "all"
                  ? "No URLs found matching your filters"
                  : "No URLs found"}
              </h3>
              <p className="text-gray-600">
                {searchQuery || filterPeriod !== "all"
                  ? "Try adjusting your search or filter settings"
                  : "Create your first shortened URL to get started"}
              </p>
            </div>
          ) : (
            <UrlTable
              urls={filteredUrls}
              selectedUrls={selectedUrls}
              onSelectUrl={handleSelectUrl}
              onSelectAll={handleSelectAll}
              onCopyUrl={copyToClipboard}
            />
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredUrls.length} URLs
            {(searchQuery || filterPeriod !== "all") && " (filtered)"}
          </p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled>
              Previous
            </Button>
            <Button variant="secondary" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
