const TabsSkeleton = () => (
  <div className="grid grid-cols-4 gap-4 w-full my-4 px-4">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="h-10 bg-gray-300 rounded-full animate-pulse transition-opacity duration-700 ease-in-out opacity-90 hover:opacity-100"
      />
    ))}
  </div>
);

export default TabsSkeleton;