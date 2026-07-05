import { useState, useEffect } from "react";

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

const BOOKMARKS_STORAGE_KEY = "ic32-bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (stored) {
        setBookmarks(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load bookmarks:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error("Failed to save bookmarks:", error);
      }
    }
  }, [bookmarks, isLoaded]);

  const addBookmark = (item: Omit<BookmarkedItem, "savedAt">) => {
    setBookmarks((prev) => {
      // Check if already bookmarked
      if (prev.some((b) => b.id === item.id)) {
        return prev;
      }
      return [...prev, { ...item, savedAt: Date.now() }];
    });
  };

  const removeBookmark = (itemId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== itemId));
  };

  const toggleBookmark = (item: Omit<BookmarkedItem, "savedAt">) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) {
        return prev.filter((b) => b.id !== item.id);
      } else {
        return [...prev, { ...item, savedAt: Date.now() }];
      }
    });
  };

  const isBookmarked = (itemId: string) => {
    return bookmarks.some((b) => b.id === itemId);
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    bookmarkIds: new Set(bookmarks.map((b) => b.id)),
  };
}
