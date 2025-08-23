const ActionButtonSkeleton = ({ items = 1 }) => {
  return (
    <div className="flex flex-row gap-2 flex-wrap items-center">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="w-28 h-9 bg-gray-300 rounded-full animate-pulse"
        />
      ))}
    </div>
  );
};

export default ActionButtonSkeleton;
