import RecentSearches from "./recentSearches";
import { getTopTags } from "./action";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { tagInterface } from "@/lib/types/tagInterface";

export default async function SearchPage() {
  const token = (await cookies()).get("access_token")?.value || null;
  if (!token) {
    const originalUrl = `/search`;
    redirect(`/refresh?redirect=${encodeURIComponent(originalUrl)}&reason=no_token`);
  }

  let topTagsData: tagInterface[] = [];
  try {
    topTagsData = await getTopTags(token, 10);
  } catch (error) {
    console.error("Failed to fetch top tags:", error);
    topTagsData = []; // backup data
  }

  const topTags = topTagsData.map((tag) => tag.name);

  return (
    <div className="flex flex-col gap-8">
      <RecentSearches topTags={topTags} />
    </div>
  );
}