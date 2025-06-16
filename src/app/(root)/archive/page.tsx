import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Archive } from "./archive";

import { getArchivedPhotos } from "./action";

import { getAllAlbums } from "../albums/action";

export default async function ArchivePage() {
  const token = (await cookies()).get("access_token")?.value || null;
  if (token == null) {
    const originalUrl = `/archive`;
    redirect(`/refresh?redirect=${encodeURIComponent(originalUrl)}`);
  }

  try {
    const archivedPhotos = await getArchivedPhotos(token, 0, 10);
    const albumList = await getAllAlbums(token, 0, 10);
    return (
      <Archive
        token={token || ""}
        initialPhotos={archivedPhotos.photos}
        initialTotalCount={archivedPhotos.total_photos_count}
        initialAlbumList={albumList.albums}
      />
    );
  } catch (error) {
    console.error("Error fetching albums:", error);
    return <div>Error loading albums</div>;
  }
}
