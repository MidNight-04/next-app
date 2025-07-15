const TaskCardSkeleton = () => (
  <div className="bg-white w-full rounded-2xl p-8 flex gap-4 justify-between shadow-md animate-pulse">
    <span className="h-20 rounded-full w-1 bg-gray-200" />
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-full bg-gray-300" />
        <div className="h-4 w-32 bg-gray-300 rounded" />
      </div>
      <div className="h-5 w-1/3 bg-gray-300 rounded" />
      <div className="flex flex-wrap gap-3 mt-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 w-24 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  </div>
);

export default TaskCardSkeleton;
