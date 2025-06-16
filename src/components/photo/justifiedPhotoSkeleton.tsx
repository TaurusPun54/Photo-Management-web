"use client";

import { useState, useEffect, useRef } from "react";

interface JustifiedPhotoSkeletonProps {
  rowCount?: number;
  photosPerRow?: number;
  targetRowHeight?: number;
  containerPadding?: number;
  boxSpacing?: number;
}

export function JustifiedPhotoSkeleton({
  rowCount = 3,
  photosPerRow = 4,
  targetRowHeight = 250,
  containerPadding = 16,
  boxSpacing = 8,
}: JustifiedPhotoSkeletonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width on resize
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

  // Generate skeleton rows
  const generateSkeletonRows = () => {
    if (containerWidth <= 0) return null;

    const rows = [];
    const availableWidth = containerWidth - 2 * containerPadding;

    for (let i = 0; i < rowCount; i++) {
      // Randomize number of photos per row for more natural look
      const photosInThisRow = photosPerRow
      const photoWidth =
        (availableWidth - (photosInThisRow - 1) * boxSpacing) / photosInThisRow;

      const rowPhotos = [];
      for (let j = 0; j < photosInThisRow; j++) {
        // Add slight variation to widths for more natural look
        const variationFactor = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        const width = photoWidth * variationFactor;

        rowPhotos.push(
          <div
            key={`skeleton-${i}-${j}`}
            className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
            style={{
              width,
              height: targetRowHeight,
              marginRight: j < photosInThisRow - 1 ? boxSpacing : 0,
            }}
          />
        );
      }

      rows.push(
        <div
          key={`row-${i}`}
          className="flex justify-start"
          style={{ marginBottom: boxSpacing }}
        >
          {rowPhotos}
        </div>
      );
    }

    return rows;
  };

  return (
    <div ref={containerRef} className="w-full">
      {generateSkeletonRows()}
    </div>
  );
}
