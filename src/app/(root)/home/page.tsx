import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Home } from "./home";

import { getAllPhotos } from "./action";
import { getAllAlbums } from "../albums/action";

export default async function GalleryPage() {
  const token = (await cookies()).get("access_token")?.value || null;
  if (token == null) {
    const originalUrl = `/home`;
    redirect(`/refresh?redirect=${encodeURIComponent(originalUrl)}`);
  }

  try {
    const initialPhotosData = await getAllPhotos(token || "", 0, 10);
    const initialAlbumList = await getAllAlbums(token || "", 0, 10);
    return (
      <Home
        token={token || ""}
        initialPhotosData={initialPhotosData}
        initialAlbumList={initialAlbumList}
      />
    );
  } catch (error) {
    console.error("Error fetching photos:", error);
    return <div>Error loading gallery</div>;
  }
}
