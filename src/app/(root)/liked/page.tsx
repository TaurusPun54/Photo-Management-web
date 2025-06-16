import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getLikedPhotos } from "./action";
import { Liked } from "./likedPhotos";
import { getAllAlbums } from "../albums/action";
export default async function LikedPage() {
  const token = (await cookies()).get("access_token")?.value || null;
  if (token == null) {
    const originalUrl = `/liked`;
    redirect(`/refresh?redirect=${encodeURIComponent(originalUrl)}`);
  }
  try {
    const likedPhotos = await getLikedPhotos(token, 0, 10);
    const albumList = await getAllAlbums(token, 0, 10);
    return <Liked token={token} initialPhotos={likedPhotos.photos} albumList={albumList} />;
  } catch (error) {
    console.error("Error fetching liked photos:", error);
    return <div>Error loading liked photos</div>;
  }
}
