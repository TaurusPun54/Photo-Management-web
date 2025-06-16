"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/search/searchbar";
import { Tag, X } from "lucide-react";
import { toast } from "sonner";

interface RecentSearchesProps {
  topTags: string[];
}

export default function RecentSearches({ topTags }: RecentSearchesProps) {
  const router = useRouter();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isNavigating, setIsNavigating] = useState(false);

  // load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  }, []);

  // save recent searches
  const saveRecentSearches = (searches: string[]) => {
    try {
      localStorage.setItem("recentSearches", JSON.stringify(searches));
    } catch (error) {
      console.error("Failed to save recent searches:", error);
    }
  };

  const handleTagClick = (tag: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(`/search/${encodeURIComponent(tag)}`);
    const newSearches = [
      tag,
      ...recentSearches.filter((t) => t !== tag),
    ].slice(0, 10);
    setRecentSearches(newSearches);
    saveRecentSearches(newSearches);
    setTimeout(() => setIsNavigating(false), 500); // simple debounce
  };

  const removeRecentSearch = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    const newSearches = recentSearches.filter((t) => t !== tag);
    setRecentSearches(newSearches);
    saveRecentSearches(newSearches);
    toast.info(`Removed "${tag}" from recent searches`);
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Search</h1>
        <SearchBar />
      </div>

      {recentSearches.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((tag) => (
              <div
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full cursor-pointer hover:bg-secondary/80 ${
                  isNavigating ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Tag className="h-4 w-4 mr-1" />
                <span>{tag}</span>
                <button
                  onClick={(e) => removeRecentSearch(e, tag)}
                  className="ml-2 rounded-full hover:bg-background/20 p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Top Tags</h2>
        {topTags.length === 0 ? (
          <p className="text-gray-500">No popular tags available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {topTags.map((tag) => (
              <Card
                key={tag}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  isNavigating ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => handleTagClick(tag)}
              >
                <CardContent className="p-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  <span className="font-medium">{tag}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}