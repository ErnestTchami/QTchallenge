import { urlService } from "@/services/url";
import { Url } from "@/types/url";
import { toast } from "react-hot-toast";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";

export function useUrls() {
  const queryClient = useQueryClient();

  // Query for fetching URLs
  const {
    data: urls = [],
    isLoading,
    error,
  }: UseQueryResult<Url[], Error> = useQuery({
    queryKey: ["urls"],
    queryFn: urlService.getUserUrls,
  });

  const createUrlMutation = useMutation({
    mutationFn: (longUrl: string) => urlService.createShortUrl(longUrl),
    onSuccess: (newUrl) => {
      queryClient.setQueryData(["urls"], (oldUrls: Url[] = []) => [
        newUrl,
        ...oldUrls,
      ]);
      toast.success("URL shortened successfully!");
    },
    onError: () => {
      toast.error("Failed to create short URL");
    },
  });

  // Mutation for deleting URLs
  const deleteUrlMutation = useMutation({
    mutationFn: urlService.deleteUrl,
    onSuccess: (_, deletedId) => {
      // Update URLs cache
      queryClient.setQueryData(["urls"], (oldUrls: Url[] = []) =>
        oldUrls.filter((url) => url.id !== deletedId)
      );
      toast.success("URL deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete URL");
    },
  });

  // Copy URL to clipboard
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  // Stats for the dashboard
  const stats = {
    totalUrls: urls.length,
    totalClicks: urls.reduce((sum, url) => sum + url.clicks, 0),
    recentUrls: urls.slice(0, 5),
    mostClicked:
      urls.length > 0 ? [...urls].sort((a, b) => b.clicks - a.clicks)[0] : null,
  };

  return {
    urls,
    isLoading,
    error,
    stats,
    createUrl: createUrlMutation.mutate,
    deleteUrl: deleteUrlMutation.mutate,
    isCreating: createUrlMutation.isPending,
    isDeleting: deleteUrlMutation.isPending,
    copyToClipboard,
  };
}

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: num > 9999 ? "compact" : "standard",
    compactDisplay: "short",
  }).format(num);
};
