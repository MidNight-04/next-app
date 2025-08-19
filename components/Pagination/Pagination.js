import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';

const Pagination = ({
  currentPage,
  setCurrentPage,
  isPreviousData,
  hasMore,
}) => (
  <div className="flex flex-row gap-2 items-center w-full justify-center mb-4">
    <button
      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
      className="flex flex-row gap-2 items-center bg-secondary text-primary px-3 py-2 rounded-3xl"
      disabled={currentPage === 1}
    >
      <MdSkipPrevious />
      Last Page
    </button>
    <span className="text-secondary font-semibold">Page {currentPage}</span>
    <button
      onClick={() => setCurrentPage(prev => prev + 1)}
      className="flex flex-row gap-2 items-center bg-secondary text-primary px-3 py-2 rounded-3xl"
      disabled={isPreviousData || !hasMore}
    >
      Next Page
      <MdSkipNext />
    </button>
  </div>
);

export default Pagination;