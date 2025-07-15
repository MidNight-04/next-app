import { SearchOutlined } from '@mui/icons-material';

const PageHeaderSkeleton = () => (
  <div className="flex justify-between items-center my-4 w-full px-5">
    <div className="h-8 w-40 bg-gray-300 rounded" />
    <div className="relative w-72">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <SearchOutlined fontSize="small" />
      </div>
      <div className="pl-10 pr-4 py-5 rounded-2xl border border-gray-300 bg-gray-200 w-full" />
    </div>
  </div>
);

export default PageHeaderSkeleton;
