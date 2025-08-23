const MaterialRequestSkeleton = () => (
  <div className="w-full my-4 space-y-4">
    <div className="border rounded-2xl shadow-sm bg-white animate-pulse">
      {/* Header Skeleton */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="h-5 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-16"></div>
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-40"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-36"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
      </div>

      {/* Materials Section Skeleton */}
      <div className="border-t bg-gray-50 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ordered Materials Skeleton */}
          <div>
            <div className="h-5 bg-gray-300 rounded w-32 mb-3"></div>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-2">
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="divide-y">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-2 flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Received Materials Skeleton */}
          <div>
            <div className="h-5 bg-gray-300 rounded w-32 mb-3"></div>
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-2">
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MaterialRequestSkeleton;
