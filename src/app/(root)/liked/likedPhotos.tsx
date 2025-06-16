"use client";

import { useEffect } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import SearchBar from "@/components/search/searchbar";
import { JustifiedPhotoGrid } from "@/components/photo/justifiedPhotoGrid";
import { getLikedPhotos } from "./action";
import { getAllAlbums } from "@/app/(root)/albums/action";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";

interface LikedPhotosProps {
  token: string;
  initialPhotos: photoInterface[];
  initialTotalCount: number;
  initialAlbumList: albumInterface[];
}

export function Liked({
  token,
  initialPhotos,
  initialTotalCount,
  initialAlbumList,
}: LikedPhotosProps) {
  const queryClient = useQueryClient();

  // Manage album data
  const { data: albumList = [] } = useQuery({
    queryKey: ["albums"],
    queryFn: () => getAllAlbums(token, 0, 10),
    initialData: initialAlbumList,
    staleTime: 5 * 60 * 1000,
  });

  // Manage photo data
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["photos", "liked"],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10;
      const response = await getLikedPhotos(token, pageParam, limit);
      return {
        photos: response.photos.filter((photo: photoInterface) => photo && photo.id),
        total_photos_count: response.total_photos_count,
        nextSkip: pageParam + limit,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.nextSkip < lastPage.total_photos_count ? lastPage.nextSkip : undefined,
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

  // Error prompt
  useEffect(() => {
    if (isError) {
      toast.error(`Failed to load liked photos: ${error?.message}`);
    }
  }, [isError, error]);

  if (isLoading && photos.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">Liked</h1>
        <SearchBar />
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-xl text-gray-500 mb-4">No liked photos found</p>
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
            queryClient.setQueryData(["photos", "liked"], (oldData: any) => ({
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
            }));
          }}
          showArchiveOption={true}
          showRestoreOption={false}
          targetRowHeight={250}
        />
      )}
    </div>
  );
}