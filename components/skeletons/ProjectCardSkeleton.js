const ProjectCardSkeleton = ({ items = 3 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-3xl shadow-md animate-pulse p-8 mb-4 flex justify-between gap-4 -md:flex-col"
        >
          {/* Left content */}
          <div className="w-full flex flex-col gap-4">
            <div className="flex flex-row gap-4">
              <span className="h-[88px] rounded-full w-1 bg-gray-300 -md:h-16" />
              <div className="flex flex-col gap-3 text-gray-300">
                <div className="w-36 h-4 bg-gray-300 rounded" />
                <div className="w-48 h-4 bg-gray-300 rounded" />
                <div className="w-64 h-4 bg-gray-300 rounded" />
              </div>
            </div>

            {/* Info tags */}
            <div className="flex flex-wrap gap-4 mt-8 -lg:mt-2 -lg:gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <div
                  key={n}
                  className="w-36 h-10 bg-gray-200 rounded-full -md:w-24"
                />
              ))}
            </div>
          </div>

          {/* Right: circular progress + icons */}
          <div className="flex flex-row justify-between items-center gap-4 -md:flex-row -md:justify-start">
            <div className="h-28 w-28 border-[3px] border-gray-300 rounded-full flex justify-center items-center -md:h-16 -md:w-16">
              <div className="h-20 w-20 bg-gray-200 rounded-full -md:h-12 -md:w-12" />
            </div>
            <div className="flex flex-col gap-3 justify-between h-full items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="w-10 h-10 bg-red-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectCardSkeleton;
