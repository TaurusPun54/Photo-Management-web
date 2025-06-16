"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings } from "lucide-react";
import { JustifiedPhotoGrid } from "@/components/photo/justifiedPhotoGrid";
import SearchBar from "@/components/search/searchbar";
import { getAlbumById, getAllAlbums } from "../action";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";

interface AlbumDetailPageProps {
  token: string;
  albumData: albumInterface;
  initialPhotos: photoInterface[];
  initialTotalCount: number;
  initialAlbums: albumInterface[];
}

export function AlbumDetail({
  token,
  albumData,
  initialPhotos,
  initialTotalCount,
  initialAlbums,
}: AlbumDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Album list query
  const { data: albumList = [] } = useQuery({
    queryKey: ["albums"],
    queryFn: () => getAllAlbums(token, 0, 10),
    initialData: initialAlbums,
    staleTime: 5 * 60 * 1000,
  });

  // Photos query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["photos", "album", albumData.id],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10;
      const response = await getAlbumById(
        token,
        albumData.id,
        pageParam,
        limit
      );
      return {
        photos: response.photos.filter(
          (photo: photoInterface) => photo && photo.id
        ),
        total_photos_count: response.total_photos_count,
        nextSkip: pageParam + limit,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextSkip < lastPage.total_photos_count
        ? lastPage.nextSkip
        : undefined,
    initialPageParam: 0,
    initialData: {
      pages: [
        {
          photos: initialPhotos,
          total_photos_count: initialTotalCount,
          nextSkip: initialPhotos.length,
        },
      ],
      pageParams: [0],
    },
  });

  const photos = data?.pages.flatMap((page) => page.photos) || [];

  useEffect(() => {
    if (!albumData) {
      router.push("/albums");
    }
  }, [albumData, router]);

  // Error prompt
  useEffect(() => {
    if (isError) {
      toast.error(`Failed to load album: ${error?.message}`);
    }
  }, [isError, error]);

  if (isLoading && photos.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!albumData) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/albums")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl font-bold">{albumData.name}</h1>
        </div>
        <div className="flex gap-4">
        <SearchBar />
        <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" /> Album Settings
          </Button>
        </div>
      </div>

      {/* <div className="mb-8">
        <p className="text-4xl font-bold">{albumData.description}</p>
      </div> */}

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-xl text-gray-500 mb-4">No photos in this album</p>
          <p className="text-gray-400">
            Add photos to this album to see them here
          </p>
        </div>
      ) : (
        <JustifiedPhotoGrid
          token={token}
          photos={photos}
          fetchNextPage={fetchNextPage}
          hasMore={hasNextPage}
          isFetching={isFetchingNextPage}
          totalCounts={data?.pages[0]?.total_photos_count || photos.length}
          setPhotoList={(newPhotos) => {
            queryClient.setQueryData(
              ["photos", "album", albumData.id],
              (oldData: any) => ({
                ...oldData,
                pages: [
                  {
                    photos: newPhotos,
                    total_photos_count:
                      oldData?.pages[0]?.total_photos_count || newPhotos.length,
                    nextSkip: newPhotos.length,
                  },
                  ...(oldData?.pages.slice(1) || []),
                ],
              })
            );
          }}
          showArchiveOption={true}
          showRestoreOption={false}
          removeFromAlbum={true}
          album={albumData}
          targetRowHeight={250}
        />
      )}
    </div>
  );
}
