'use client';

export function SearchSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>
      <div className="space-y-3">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md" />
      </div>
    </div>
  );
} 