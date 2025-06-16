import { JustifiedPhotoSkeleton } from "@/components/photo/justifiedPhotoSkeleton"

export default function SearchLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      </div>

      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />

      <JustifiedPhotoSkeleton rowCount={4} photosPerRow={4} targetRowHeight={250} />
    </div>
  )
}
