export default function RecentSearchesLoading() {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex justify-between">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
          <div className="h-10 w-64 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
        </div>
  
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
  
        <div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  