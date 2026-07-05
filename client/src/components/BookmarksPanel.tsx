import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";

interface BookmarkedItem {
  id: string;
  type: "section" | "topic" | "definition" | "keypoint" | "example";
  title: string;
  content: string;
  sectionId: number;
  sectionTitle: string;
  topicId?: string;
  topicTitle?: string;
  savedAt: number;
}

interface BookmarksPanelProps {
  bookmarks: BookmarkedItem[];
  onRemoveBookmark: (itemId: string) => void;
  onSelectBookmark: (item: BookmarkedItem) => void;
}

export default function BookmarksPanel({
  bookmarks,
  onRemoveBookmark,
  onSelectBookmark,
}: BookmarksPanelProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "section":
        return "bg-blue-100 text-blue-800";
      case "topic":
        return "bg-purple-100 text-purple-800";
      case "definition":
        return "bg-green-100 text-green-800";
      case "keypoint":
        return "bg-orange-100 text-orange-800";
      case "example":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "section":
        return "📚";
      case "topic":
        return "📖";
      case "definition":
        return "📝";
      case "keypoint":
        return "⭐";
      case "example":
        return "💡";
      default:
        return "🔍";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group bookmarks by section
  const groupedBookmarks = bookmarks.reduce(
    (acc, bookmark) => {
      const sectionKey = `section-${bookmark.sectionId}`;
      if (!acc[sectionKey]) {
        acc[sectionKey] = {
          sectionId: bookmark.sectionId,
          sectionTitle: bookmark.sectionTitle,
          items: [],
        };
      }
      acc[sectionKey].items.push(bookmark);
      return acc;
    },
    {} as Record<
      string,
      { sectionId: number; sectionTitle: string; items: BookmarkedItem[] }
    >
  );

  if (bookmarks.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="w-5 h-5" />
            My Bookmarks
          </CardTitle>
          <CardDescription>Save important content for quick access</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Bookmark className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-gray-500">No bookmarks yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Click the bookmark icon to save important content
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bookmark className="w-5 h-5" />
              My Bookmarks
            </CardTitle>
            <CardDescription>{bookmarks.length} saved items</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="divide-y divide-gray-200">
          {Object.entries(groupedBookmarks).map(([key, group]) => (
            <div key={key} className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                Section {group.sectionId}: {group.sectionTitle}
              </h3>

              <div className="space-y-2">
                {group.items.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">{getTypeIcon(bookmark.type)}</span>
                      <Badge className={`text-xs ${getTypeColor(bookmark.type)}`}>
                        {bookmark.type}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-auto">
                        {formatDate(bookmark.savedAt)}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectBookmark(bookmark)}
                      className="text-left w-full mb-2 hover:text-blue-600 transition-colors"
                    >
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {bookmark.title}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {bookmark.content}
                      </p>
                    </button>

                    <button
                      onClick={() => onRemoveBookmark(bookmark.id)}
                      className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
