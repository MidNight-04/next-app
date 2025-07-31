const LogSkeleton = ({ items = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse flex flex-col gap-3"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full" />
              <div className="w-40 h-4 bg-gray-300 rounded" />
            </div>
            <div className="w-32 h-3 bg-gray-200 rounded" />
          </div>
          <div className="w-full h-3 bg-gray-200 rounded" />
          <div className="w-3/4 h-3 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};

export default LogSkeleton;
