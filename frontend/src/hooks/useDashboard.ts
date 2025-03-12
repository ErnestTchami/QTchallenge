import { useState } from "react";
import { useUrls } from "@/hooks/useUrls";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const urlSchema = z.object({
  longUrl: z.string().url("Please enter a valid URL"),
});
type UrlFormValues = z.infer<typeof urlSchema>;

function useDashboard() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { urls, isLoading, stats, createUrl, isCreating, copyToClipboard } =
    useUrls();
  const form = useForm<UrlFormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      longUrl: "",
    },
  });

  const onSubmit = async (values: UrlFormValues) => {
    if (!values.longUrl) return;
    try {
      await createUrl(values.longUrl);
      form.reset();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error shortening URL:", error);
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
  };

  return {
    activeTab,
    selectedUrls,
    showCreateModal,
    isLoading,
    stats,
    createUrl,
    isCreating,
    copyToClipboard,
    form,
    onSubmit,
    handleSelectUrl,
    handleSelectAll,
    setShowCreateModal,
    setActiveTab,
    urls,
  };
}

export default useDashboard;
