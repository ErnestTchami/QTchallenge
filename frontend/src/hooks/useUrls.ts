import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { urlService, getShortUrl } from "@/services/api";
import toast from "react-hot-toast";

export interface Url {
  id: string;
  longUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

// Dummy data
const dummyUrls: Url[] = [
  {
    id: "1",
    shortUrl: "google123",
    longUrl: "https://www.google.com",
    clicks: 156,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: "2",
    shortUrl: "yt-video",
    longUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    clicks: 89,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: "3",
    shortUrl: "github-repo",
    longUrl: "https://github.com/facebook/react",
    clicks: 234,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: "4",
    shortUrl: "docs-link",
    longUrl: "https://docs.google.com/document/d/1234",
    clicks: 45,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
  },
  {
    id: "5",
    shortUrl: "meet-xyz",
    longUrl: "https://meet.google.com/abc-defg-hij",
    clicks: 12,
    createdAt: new Date().toISOString(), // Just now
  },
];

// API functions
const fetchUrls = async (): Promise<Url[]> => {
  try {
    const response = await fetch("/api/urls");
    if (!response.ok) throw new Error("Failed to fetch URLs");
    return response.json();
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return dummyUrls; // Return dummy data on failure
  }
};

const createUrl = async (longUrl: string): Promise<Url> => {
  const response = await fetch("/api/urls", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ longUrl }),
  });

  if (!response.ok) throw new Error("Failed to create short URL");
  return response.json();
};

// Copy to clipboard function
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (error) {
    console.error("Failed to copy:", error);
    toast.error("Failed to copy to clipboard");
  }
};

export function useUrls() {
  const queryClient = useQueryClient();

  // Query for fetching URLs
  const {
    data: urls,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["urls"],
    queryFn: fetchUrls,
    initialData: dummyUrls, // Show dummy data initially
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests twice
  });

  // Mutation for creating new URLs
  const createUrlMutation = useMutation({
    mutationFn: createUrl,
    onSuccess: () => {
      toast.success("URL shortened successfully!");
      queryClient.invalidateQueries({ queryKey: ["urls"] });
    },
    onError: (error) => {
      toast.error("Failed to create short URL");
      console.error("Error creating URL:", error);
    },
  });

  // Stats for the dashboard
  const stats = {
    totalUrls: urls.length ?? 2,
    totalClicks: urls.reduce((sum, url) => sum + url.clicks, 0) ?? 2,
    recentUrls: urls.slice(0, 5) ?? [], // Last 5 URLs
    mostClicked: [...urls].sort((a, b) => b.clicks - a.clicks)[0] ?? [], // URL with most clicks
  };

  return {
    urls,
    isLoading,
    error,
    stats,
    createUrl: createUrlMutation.mutateAsync,
    isCreating: createUrlMutation.isPending,
    copyToClipboard,
  };
}

// Helper function to format dates
export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

// Helper function to format numbers
export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: num > 9999 ? "compact" : "standard",
    compactDisplay: "short",
  }).format(num);
};
