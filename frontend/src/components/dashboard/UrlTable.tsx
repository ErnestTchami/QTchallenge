import { Button } from "@/components/ui/Button";
import { Url } from "@/types/types";
import { Copy, ExternalLink, MoreHorizontal } from "lucide-react";

interface UrlTableProps {
  urls: Url[] | any;
  selectedUrls: string[];
  onSelectUrl: (id: string) => void;
  onSelectAll: (selected: boolean) => void;
  onCopyUrl: (shortUrl: string) => void;
}

export function UrlTable({
  urls,
  selectedUrls,
  onSelectUrl,
  onSelectAll,
  onCopyUrl,
}: UrlTableProps) {
  return (
    <table className="w-full z-20">
      <thead className="bg-indigo-50/50">
        <tr>
          <th className="w-8 p-4">
            <input
              type="checkbox"
              className="rounded border-indigo-300"
              checked={selectedUrls.length === urls.length}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
          <th className="text-left p-4 text-xs font-medium text-indigo-600">
            Link
          </th>
          <th className="text-left p-4 text-xs font-medium text-indigo-600">
            Created
          </th>
          <th className="text-left p-4 text-xs font-medium text-indigo-600">
            Clicks
          </th>
          <th className="text-right p-4 text-xs font-medium text-indigo-600">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-indigo-100">
        {urls.map((url) => (
          <tr key={url.id} className="hover:bg-indigo-50/30">
            <td className="p-4">
              <input
                type="checkbox"
                className="rounded border-indigo-300"
                checked={selectedUrls.includes(url.id)}
                onChange={() => onSelectUrl(url.id)}
              />
            </td>
            <td className="p-4">
              <div className="flex flex-col">
                <span className="text-indigo-600 font-medium">
                 urls/{url.short_code}
                </span>
                <span className="text-sm text-gray-500 truncate max-w-md">
                  {url.long_url}
                </span>
              </div>
            </td>
            <td className="p-4 text-sm text-gray-600">
              {new Date(url.createdAt).toLocaleDateString()}
            </td>
            <td className="p-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {url.clicks} clicks
              </span>
            </td>
            <td className="p-4">
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onCopyUrl(
                      `${process.env.NEXT_PUBLIC_API_URL}/urls/${url.short_code}`
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_URL}/urls/${url.short_code}`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
