import { useState, useMemo } from "react";
import { Search, X, BookOpen, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  type: "section" | "topic" | "definition" | "keypoint" | "example";
  title: string;
  content: string;
  sectionId: number;
  sectionTitle: string;
  topicId?: string;
  topicTitle?: string;
}

interface GlobalSearchProps {
  courseData: any;
  onSelectResult?: (result: SearchResult) => void;
  bookmarkedItems?: Set<string>;
  onToggleBookmark?: (itemId: string) => void;
}

export default function GlobalSearch({
  courseData,
  onSelectResult,
  bookmarkedItems = new Set(),
  onToggleBookmark,
}: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Build searchable content from course data
  const searchableContent = useMemo(() => {
    const results: SearchResult[] = [];

    courseData.sections.forEach((section: any) => {
      // Add section as searchable
      results.push({
        id: `section-${section.id}`,
        type: "section",
        title: section.title,
        content: section.description,
        sectionId: section.id,
        sectionTitle: section.title,
      });

      // Add topics and their content
      section.topics.forEach((topic: any) => {
        results.push({
          id: `topic-${topic.id}`,
          type: "topic",
          title: topic.title,
          content: topic.explanation || topic.definition || "",
          sectionId: section.id,
          sectionTitle: section.title,
          topicId: topic.id,
          topicTitle: topic.title,
        });

        // Add definition
        if (topic.definition) {
          results.push({
            id: `def-${topic.id}`,
            type: "definition",
            title: `Definition: ${topic.title}`,
            content: topic.definition,
            sectionId: section.id,
            sectionTitle: section.title,
            topicId: topic.id,
            topicTitle: topic.title,
          });
        }

        // Add key points
        if (topic.keyPoints && Array.isArray(topic.keyPoints)) {
          topic.keyPoints.forEach((point: string, idx: number) => {
            results.push({
              id: `keypoint-${topic.id}-${idx}`,
              type: "keypoint",
              title: `Key Point: ${topic.title}`,
              content: point,
              sectionId: section.id,
              sectionTitle: section.title,
              topicId: topic.id,
              topicTitle: topic.title,
            });
          });
        }

        // Add examples
        if (topic.examples && Array.isArray(topic.examples)) {
          topic.examples.forEach((example: string, idx: number) => {
            results.push({
              id: `example-${topic.id}-${idx}`,
              type: "example",
              title: `Example: ${topic.title}`,
              content: example,
              sectionId: section.id,
              sectionTitle: section.title,
              topicId: topic.id,
              topicTitle: topic.title,
            });
          });
        }
      });
    });

    return results;
  }, [courseData]);

  // Filter results based on search query
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return searchableContent
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.content.toLowerCase().includes(query)
      )
      .slice(0, 15); // Limit to 15 results
  }, [searchQuery, searchableContent]);

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

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search sections, topics, definitions, examples..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (searchQuery || filteredResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {filteredResults.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => {
                    onSelectResult?.(result);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                        {result.type}
                      </Badge>
                      {result.sectionTitle && (
                        <span className="text-xs text-gray-500">
                          Section {result.sectionId}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {result.title}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {result.content}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark?.(result.id);
                    }}
                    className="flex-shrink-0 mt-1"
                  >
                    <Bookmark
                      className={`w-5 h-5 transition-colors ${
                        bookmarkedItems.has(result.id)
                          ? "fill-blue-500 text-blue-500"
                          : "text-gray-300 hover:text-blue-400"
                      }`}
                    />
                  </button>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try searching for different keywords</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
