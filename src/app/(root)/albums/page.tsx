import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AlbumCards } from "./albumCards";
import { getAllAlbums } from "./action";

export default async function AlbumsPage() {
  const token = (await cookies()).get("access_token")?.value || null;
  if (token == null) {
    const originalUrl = `/albums`;
    redirect(`/refresh?redirect=${encodeURIComponent(originalUrl)}`);
  }

  try {
    const albumListData = await getAllAlbums(token, 0, 10);
    // console.log("Server-side albumListData:", albumListData.albums);
    const albums = Array.isArray(albumListData?.albums) ? albumListData.albums : [];
    return <AlbumCards token={token} albumList={albums} />;
  } catch (error) {
    console.error("Error fetching albums:", error);
    return <AlbumCards token={token} albumList={[]} />;
  }
}