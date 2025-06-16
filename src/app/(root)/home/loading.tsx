import { JustifiedPhotoSkeleton } from "@/components/photo/justifiedPhotoSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="flex gap-4">
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        </div>
      </div>

      <JustifiedPhotoSkeleton
        rowCount={4}
        photosPerRow={4}
        targetRowHeight={250}
      />
    </div>
  );
}
