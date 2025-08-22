"use client";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`min-h-screen bg-black text-white ${className}`}>
      {/* Header Skeleton */}
      <div className="container mx-auto px-4 pt-8">
        <div className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Welcome Message Skeleton */}
            <div className="mb-4 md:mb-0">
              <div className="h-10 bg-neutral-800 rounded-lg mb-2 animate-pulse w-72"></div>
              <div className="h-4 bg-neutral-800 rounded-lg animate-pulse w-96"></div>
            </div>

            {/* Time and Status Skeleton */}
            <div className="flex flex-col items-end">
              <div className="h-4 bg-neutral-800 rounded-lg mb-1 animate-pulse w-32"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-neutral-800 rounded-full animate-pulse"></div>
                <div className="h-4 bg-neutral-800 rounded-lg animate-pulse w-24"></div>
              </div>
            </div>
          </div>

          {/* AI Tools Preview Skeleton */}
          <div className="mt-6 pt-6 border-t border-neutral-700">
            <div className="flex items-center gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-neutral-800 rounded-full animate-pulse"></div>
                  <div className="h-4 bg-neutral-800 rounded-lg animate-pulse w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Widget Skeleton */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-neutral-900/80 to-neutral-800/80 backdrop-blur-sm rounded-2xl p-6 border border-neutral-700">
            <div className="h-6 bg-neutral-800 rounded-lg mb-4 animate-pulse w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-800 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Grid Skeleton */}
        <div className="mt-12">
          <div className="h-8 bg-neutral-800 rounded-lg mb-6 animate-pulse w-40"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-neutral-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="fixed bottom-8 right-8">
        <div className="flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-700">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm">Loading Dashboard...</span>
        </div>
      </div>
    </div>
  );
}
