'use client';

export function WeatherSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header Skeleton */}
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      
      {/* Main Weather Info Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
        
        {/* Weather Details Skeleton */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mb-2" />
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
} 