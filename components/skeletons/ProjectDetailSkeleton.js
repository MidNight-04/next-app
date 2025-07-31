const SkeletonProjectDetails = ({ items = 10 }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 -xl:grid-cols-4 -lg:grid-cols-3 -md:grid-cols-2 gap-4 -lg:gap-2 justify-evenly [&>div]:h-[88px] lg:[&>div]:p-[10px] -md:[&>div]:h-14 -lg:text-xs">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="p-5 w-full rounded-[14px] bg-white font-ubuntu flex justify-between items-center cursor-pointer animate-pulse"
          >
            <div className="flex items-center justify-between gap-1 lg:gap-2">
              <div className="w-24 h-4 bg-gray-300 rounded" />
              <div className="w-10 h-10 rounded-full bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg shadow-sm border border-gray-200 bg-white animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="w-28 h-4 bg-gray-300 rounded" />
            <div className="flex items-center justify-between gap-1 lg:gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-300" />
              <div className="w-10 h-10 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonProjectDetails;
