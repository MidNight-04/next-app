import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { FaClockRotateLeft } from 'react-icons/fa6';

const OverdueReportTable = ({
  isFetched,
  groupedByOverdueByEmployee,
  activeTab,
}) => {
  return (
    <>
      <div className="w-full overflow-x-auto bg-secondary font-semibold rounded-2xl">
        <table className="w-full table-auto text-center">
          <thead>
            <tr className="text-primary">
              <th className="p-4">Employee Name</th>
              <th className="py-4">
                <div className="flex flex-row items-center justify-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full" />
                  OverDue
                </div>
              </th>
              <th className="py-4 ">
                <div className="flex flex-row items-center justify-center gap-2">
                  <FaClockRotateLeft className="fill-yellow-500" />
                  Overdue Since
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isFetched &&
              groupedByOverdueByEmployee.length > 0 &&
              groupedByOverdueByEmployee.map((item, index) => {
                const taskObj = item.obj.reduce((acc, task) => {
                  const overdueDate = new Date(task.dueDate);
                  const overdueAcc = new Date(acc.dueDate);
                  return overdueDate < overdueAcc ? task : acc;
                }, item.obj[0]);
                const date = Math.abs(
                  new Date(taskObj.dueDate).getDate() - new Date().getDate()
                );
                return (
                  <tr
                    key={index}
                    className="bg-white rounded-2xl shadow-md group cursor-pointer hover:bg-white transition duration-300"
                  >
                    <td className="p-4 ">{item.employee}</td>
                    <td>{item.obj.length}</td>
                    <td>{date.toLocaleString()} days ago</td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {groupedByOverdueByEmployee?.filter(item => item.status === activeTab)
          ?.length >= 10 && (
          <div className="flex flex-row gap-2 items-center justify-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="flex flex-row gap-2 items-center bg-primary text-secondary px-3 py-2 rounded-3xl"
              disabled={currentPage === 1}
            >
              <MdSkipPrevious />
              Last Page
            </button>
            <span className="text-primary font-semibold">
              Page {currentPage}
            </span>
            <button
              onClick={() => {
                setCurrentPage(prev => prev + 1);
              }}
              className="flex flex-row gap-2 items-center bg-primary text-secondary px-3 py-2 rounded-3xl"
              disabled={isPreviousData || !data?.hasMore}
            >
              Next Page
              <MdSkipNext />
            </button>
          </div>
        )}
      </div>
      {isFetched && groupedByOverdueByEmployee.length <= 0 && (
        <p className="font-semibold text-center mt-4 text-xl">
          No Tasks Found!
        </p>
      )}
    </>
  );
};

export default OverdueReportTable;
