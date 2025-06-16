"use client";

import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { photoInterface } from "@/lib/types/photoInterface";
import { getAllPhotos } from "@/app/(root)/home/action";
import { toast } from "sonner";
import { PHOTOS_PER_PAGE } from "@/lib/constants";

interface PhotosResponse {
  photos: photoInterface[];
  total_photos_count: number;
}

interface PhotoSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  selectedPhotoList: photoInterface[];
  setSelectedPhotoList: React.Dispatch<React.SetStateAction<photoInterface[]>>;
  itemsPerPage?: number;
  onError?: (error: Error) => void;
}

export function PhotoSelectionDialog({
  isOpen,
  onClose,
  token,
  selectedPhotoList,
  setSelectedPhotoList,
  itemsPerPage = PHOTOS_PER_PAGE,
  onError,
}: PhotoSelectionDialogProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery<PhotosResponse>({
    // queryKey: ["photos", "selection"],
    queryKey: ["photos"],
    queryFn: ({ pageParam = 0 }) =>
      getAllPhotos(
        token,
        Number(pageParam) * itemsPerPage,
        itemsPerPage,
        false,
        "created_at",
        "desc"
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.photos.length === itemsPerPage ? allPages.length : undefined,
    enabled: isOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];
  const totalCount = data?.pages[0]?.total_photos_count || allPhotos.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (isError && error) {
      const message = error.message || "Unknown error";
      if (onError) onError(error);
      else toast.error(`Failed to load photos: ${message}`);
    }
  }, [isError, error, onError]);

  const handlePhotoToggle = (photo: photoInterface) => {
    setSelectedPhotoList((prev) => {
      const isSelected = prev.some((p) => p.id === photo.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== photo.id);
      }
      return [...prev, photo];
    });
  };

  const handleConfirm = () => {
    toast.success(`${selectedPhotoList.length} photos selected`);
    onClose();
  };

  const handleClose = () => {
    setSelectedPhotoList([]);
    onClose();
  };

  if (isOpen && allPhotos.length === 0 && !isFetchingNextPage && !hasNextPage) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select Photos</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-xl text-gray-500 mb-4">No photos available</p>
            <p className="text-gray-400">Upload some photos to select them</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Photos</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-4">
          {allPhotos.map((photo) => {
            if (!photo.presigned_url_thumbnail) return null;
            return (
              <div
                key={photo.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden ${
                  selectedPhotoList.some((p) => p.id === photo.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => handlePhotoToggle(photo)}
              >
                <Image
                  src={photo.presigned_url_thumbnail}
                  alt={photo.file_name || "Photo"}
                  width={photo.width / 2}
                  height={photo.height / 2}
                  className="w-full h-32 object-cover"
                  style={{ aspectRatio: `${photo.width}/${photo.height}` }}
                  loading="lazy"
                />
                {selectedPhotoList.some((p) => p.id === photo.id) && (
                  <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {selectedPhotoList.findIndex((p) => p.id === photo.id) + 1}
                  </div>
                )}
              </div>
            );
          })}
          <div
            ref={loaderRef}
            className="flex justify-center items-center py-4"
          >
            {isFetchingNextPage && (
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
                <p className="text-sm text-muted-foreground mt-2">
                  Loading more photos...
                </p>
              </div>
            )}
            {!isFetchingNextPage && hasNextPage && (
              <p className="text-sm text-muted-foreground">
                Scroll to load more photos ({allPhotos.length} of {totalCount})
              </p>
            )}
            {!isFetchingNextPage && !hasNextPage && allPhotos.length > 0 && (
              <p className="text-sm text-muted-foreground">
                No more photos to load ({allPhotos.length} photos)
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setSelectedPhotoList(allPhotos)}
          >
            Select All
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedPhotoList([])}
          >
            Clear
          </Button>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm ({selectedPhotoList.length} selected)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}