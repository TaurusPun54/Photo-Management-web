"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import PhotoUploader from "./uploader";
import { getAllPhotos } from "./action";
import { getAllAlbums } from "@/app/(root)/albums/action";
import SearchBar from "@/components/search/searchbar";
import { JustifiedPhotoGrid } from "@/components/photo/justifiedPhotoGrid";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";

interface GalleryProps {
  token: string;
  initialPhotosData: { photos: photoInterface[]; total_photos_count: number };
  initialAlbumList: albumInterface[];
}

export function Home({ token, initialPhotosData, initialAlbumList }: GalleryProps) {
  const queryClient = useQueryClient();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  // Manage album data
  const { data: { albums } = { albums: [] } } = useQuery({
    queryKey: ["albums"],
    queryFn: async () => getAllAlbums(token, 0, 10),
    initialData: { albums: initialAlbumList, total_albums_count: initialAlbumList.length },
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
    // queryKey: ["photos", "gallery"],
    queryKey: ["photos"],
    queryFn: async ({ pageParam = 0 }) => {
      const limit = 10;
      const response = await getAllPhotos(
        token,
        pageParam,
        limit,
        false,
        "created_at",
        "desc"
      );
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
          photos: initialPhotosData.photos,
          total_photos_count: initialPhotosData.total_photos_count,
          nextSkip: initialPhotosData.photos.length,
        },
      ],
      pageParams: [0],
    },
  });

  const photos = data?.pages.flatMap((page) => page.photos) || [];

  // Error prompt
  useEffect(() => {
    if (isError) {
      toast.error(`Failed to load photos: ${error?.message}`);
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
        <h1 className="text-4xl font-bold">Home</h1>
        <div className="flex gap-4">
          <SearchBar />
          <Button variant="outline" onClick={() => setIsUploaderOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-xl text-gray-500 mb-4">No photos found</p>
          <p className="text-gray-400 mb-6">Upload some photos to get started</p>
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
            queryClient.setQueryData(["photos", "home"], (oldData: any) => ({
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

      <Dialog open={isUploaderOpen} onOpenChange={setIsUploaderOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Upload Photos</DialogTitle>
            <DialogDescription>
              Drag and drop up to 5 photos or click to browse your files.
            </DialogDescription>
          </DialogHeader>
          <PhotoUploader
            token={token}
            onUploadSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ["photos"] });
              setIsUploaderOpen(false);
              toast.success("Photos uploaded successfully");
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}