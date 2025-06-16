"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import PhotoContainer from "./photoContainer";
import { PhotoMenu } from "./photoMenu";
import { PhotoViewer } from "./photoViewer";
import { photoInterface } from "@/lib/types/photoInterface";
import { albumInterface } from "@/lib/types/albumInterface";
import { toast } from "sonner";

interface JustifiedPhotoGridProps {
  token: string;
  photos: photoInterface[];
  fetchNextPage: () => void;
  hasMore: boolean;
  isFetching: boolean;
  totalCounts: number;
  setPhotoList: (photos: photoInterface[]) => void;
  showArchiveOption?: boolean;
  showRestoreOption?: boolean;
  removeFromAlbum?: boolean;
  album?: albumInterface;
  targetRowHeight?: number;
  containerPadding?: number;
  boxSpacing?: number;
}

export function JustifiedPhotoGrid({
  token,
  photos,
  fetchNextPage,
  hasMore,
  isFetching,
  totalCounts,
  setPhotoList,
  showArchiveOption = true,
  showRestoreOption = false,
  removeFromAlbum = false,
  album,
  targetRowHeight = 250,
  containerPadding = 16,
  boxSpacing = 8,
}: JustifiedPhotoGridProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Setup IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isFetching) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching, fetchNextPage]);

  // Update container width
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);
    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  const rows = useMemo(() => {
    if (containerWidth <= 0 || photos.length === 0) return [];

    const justifyPhotos = (
      photos: photoInterface[],
      containerWidth: number
    ): photoInterface[][] => {
      const rows: photoInterface[][] = [];
      let currentRow: photoInterface[] = [];
      let currentRowWidth = 0;
      const availableWidth = containerWidth - 2 * containerPadding;

      photos.forEach((photo) => {
        const aspectRatio = photo.width / photo.height;
        const scaledWidth = Math.round(targetRowHeight * aspectRatio);

        if (
          currentRowWidth + scaledWidth + currentRow.length * boxSpacing >
            availableWidth &&
          currentRow.length > 0
        ) {
          rows.push([...currentRow]);
          currentRow = [];
          currentRowWidth = 0;
        }

        currentRow.push(photo);
        currentRowWidth += scaledWidth;
      });

      if (currentRow.length > 0) {
        rows.push([...currentRow]);
      }

      return rows;
    };

    return justifyPhotos(photos, containerWidth);
  }, [photos, containerWidth, containerPadding, boxSpacing, targetRowHeight]);

  const handlePhotoClick = (rowIndex: number, photoIndex: number) => {
    const photo = rows[rowIndex][photoIndex];
    if (!photo || !photo.id) {
      toast.error("Invalid photo data");
      return;
    }
    const fullIndex = photos.findIndex((p) => p.id === photo.id);
    if (fullIndex === -1) {
      toast.error("Photo not found");
      return;
    }
    setSelectedPhotoIndex(fullIndex);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedPhotoIndex(null);
  };

  const handleNavigate = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const getRowDimensions = (row: photoInterface[], containerWidth: number) => {
    const availableWidth =
      containerWidth - 2 * containerPadding - (row.length - 1) * boxSpacing;

    let totalAspectRatio = 0;
    row.forEach((photo) => {
      totalAspectRatio += photo.width / photo.height;
    });

    const rowHeight =
      availableWidth / totalAspectRatio > 300
        ? 300
        : availableWidth / totalAspectRatio;

    const dimensions = row.map((photo) => {
      const aspectRatio = photo.width / photo.height;
      const width = rowHeight * aspectRatio;
      return { width, height: rowHeight };
    });

    return dimensions;
  };

  return (
    <div ref={containerRef} className="w-full">
      {rows.map((row, rowIndex) => {
        const dimensions = getRowDimensions(row, containerWidth);

        return (
          <div
            key={`row-${rowIndex}`}
            className="flex justify-start"
            style={{ marginBottom: boxSpacing }}
          >
            {row.map((photo, photoIndex) => (
              <div
                key={photo.id}
                className="relative"
                style={{
                  width: dimensions[photoIndex].width,
                  height: dimensions[photoIndex].height,
                  marginRight: photoIndex < row.length - 1 ? boxSpacing : 0,
                }}
              >
                <div className="h-full w-full">
                  <PhotoContainer
                    photo={photo}
                    onClick={() => handlePhotoClick(rowIndex, photoIndex)}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div className="absolute top-2 right-1">
                    <PhotoMenu
                      token={token}
                      photo={photo}
                      photoList={photos}
                      setPhotoList={setPhotoList}
                      toArchive={showArchiveOption}
                      removeFromAlbum={removeFromAlbum}
                      album={album}
                      restoreFromArchive={showRestoreOption}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      <div
        ref={loaderRef}
        className="flex justify-center items-center py-8 mt-4 min-h-[100px]"
      >
        {isFetching && (
          <div className="flex flex-col items-center bg-background/80 px-6 py-4 rounded-lg shadow-md">
            <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-primary animate-spin" />
            <p className="mt-3 font-medium">Loading more photos...</p>
            <p className="text-sm text-muted-foreground mt-1">
              {photos.length} of {totalCounts} photos loaded
            </p>
          </div>
        )}
        {!isFetching && hasMore && (
          <div className="h-20 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Scroll for more photos ({photos.length} of {totalCounts} loaded)
            </p>
          </div>
        )}
        {!isFetching && !hasMore && photos.length > 0 && (
          <p className="text-sm text-muted-foreground bg-background/80 px-4 py-2 rounded-lg">
            End of gallery • {photos.length} photos loaded
          </p>
        )}
      </div>

      {isViewerOpen && selectedPhotoIndex !== null && (
        <PhotoViewer
          isOpen={isViewerOpen}
          onClose={handleCloseViewer}
          token={token}
          photoList={photos}
          currentPhotoIndex={selectedPhotoIndex}
          onNavigate={handleNavigate}
          setPhotoList={setPhotoList}
        />
      )}
    </div>
  );
}