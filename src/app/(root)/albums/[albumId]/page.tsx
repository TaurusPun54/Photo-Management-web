import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AlbumDetail } from "./albumDetail";
import { getAllAlbums, getAlbumById } from "../action";
import { UUID } from "crypto";
// import { albumInterface } from "@/lib/albumInterface";

export default async function AlbumPage({
  params,
}: {
  params: { albumId: UUID };
}) {
  const token = (await cookies()).get("access_token")?.value || null;
  if (token == null) {
    // Redirect to the refresh page with the original URL as a query parameter
    const originalUrl = `/albums/${params.albumId}`;
    redirect(`/refresh?redirect=${encodeURIComponent(originalUrl)}`);
  }
  const { albumId } = await params;
  //   console.log("albumId:", id);

  try {
    // Fetch album data with photos
    const albumData = await getAlbumById(
      token || "",
      albumId,
      0, // skip
      10, // limit (adjust as needed)
      "added_at",
      "desc",
      false
    );
    // console.log("albumData", albumData);

    // Fetch all albums for the PhotoMenu
    const albumListData = await getAllAlbums(
      token || "",
      0, // skip
      10,
      "created_at",
      "desc"
    );
    // console.log("albumListData", albumListData);

    const { photos, ...albumDataWithoutPhotos } = albumData;

    return (
      //   <div className="flex space-between">
      <AlbumDetail
        token={token || ""}
        albumData={albumDataWithoutPhotos}
        initialPhotos={photos}
        initialTotalCount={albumData.total_photos_count}
        initialAlbums={albumListData.albums}
      />
      //   </div>
    );
  } catch (error) {
    console.error("Error fetching album data:", error);
    return <div>Error loading album</div>;
  }
}
