import { cookies } from "next/headers";
import SearchTag from "./searchTag";
import { redirect } from "next/navigation";
import { searchPhotos } from "@/app/(root)/search/action";
import { getAllAlbums } from "@/app/(root)/albums/action";
import { albumInterface } from "@/lib/types/albumInterface";

export default async function SearchPage({
  params,
}: {
  params: { tag: string };
}) {
  const token = (await cookies()).get("access_token")?.value || null;
  if (!token) {
    const originalUrl = `/search/${params.tag}`;
    redirect(
      `/refresh?redirect=${encodeURIComponent(originalUrl)}&reason=no_token`
    );
  }

  const { tag } = await params;
  let searchResult = { photos: [], total_photos_count: 0 };
  let albums: albumInterface[] = [];

  try {
    searchResult = await searchPhotos(token, 0, 10, "created_at", "desc", tag);
  } catch (error) {
    console.error("Failed to search photos:", error);
    searchResult = { photos: [], total_photos_count: 0 };
  }

  try {
    const albumsData = await getAllAlbums(token, 0, 10, "created_at", "desc");
    albums = albumsData.albums;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    albums = [];
  }

  return (
    // <div className="flex space-between">
      <SearchTag
        token={token}
        tag={tag}
        initialPhotos={searchResult.photos}
        initialTotalCount={searchResult.total_photos_count}
        initialAlbumList={albums}
      />
    // </div>
  );
}
