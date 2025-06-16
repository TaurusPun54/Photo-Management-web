"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SearchBar({
  prevSearchTag = "",
}: {
  prevSearchTag?: string;
}) {
  const router = useRouter();
  const [tag, setTag] = useState(prevSearchTag);

  const handleSearch = () => {
    if (!tag.trim()) {
      toast.error("Please enter a search tag");
      return;
    }
    router.push(`/search/${encodeURIComponent(tag.trim())}`);
  };

  return (
    <div className="relative w-64 flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          type="search"
          placeholder="Search photos..."
          value={tag}
          className="pl-8"
        />
      </div>
      <Button variant="ghost" size="icon" onClick={handleSearch}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}