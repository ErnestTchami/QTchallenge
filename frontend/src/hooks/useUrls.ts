import { urlService } from "@/services/url";
import { toast } from "react-hot-toast";
import { useQuery, useMutation } from "@tanstack/react-query";

export function useUrls() {
  const {
    data: urls = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["urls"],
    queryFn: urlService.getUserUrls,
  });

  const { mutate: createUrl, isPending: isCreating } = useMutation({
    mutationFn: (longUrl: string) => urlService.createShortUrl(longUrl),
    onSuccess: () => {
      refetch();
      toast.success("URL shortened successfully!");
    },
    onError: () => {
      toast.error("Failed to create short URL");
    },
  });

  const { mutate: deleteUrl, isPending: isDeleting } = useMutation({
    mutationFn: urlService.deleteUrl,
    onSuccess: () => {
      refetch();
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
    createUrl,
    deleteUrl,
    isCreating,
    isDeleting,
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
