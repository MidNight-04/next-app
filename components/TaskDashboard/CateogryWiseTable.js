import { FaRegClock } from 'react-icons/fa';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CateogryWiseTable = ({ isFetched, groupedByCategory, activeTab }) => {
  return (
    <>
      <div className="w-full overflow-x-auto bg-secondary font-semibold rounded-2xl">
        <table className="w-full table-auto text-center">
          <thead>
            <tr className="text-primary">
              <th className="p-4">Category</th>
              <th className="px-4">Total</th>
              <th>
                <div className="flex flex-col items-center px-4">
                  <span>Not Completed</span>
                  <div className="flex gap-2 mt-1 flex-row justify-evenly w-full">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      Overdue
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 border-2 border-yellow-500 rounded-full"></span>
                      Pending
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-orange-500 rounded-full animate-spin"></span>
                      In Progress
                    </div>
                  </div>
                </div>
              </th>
              <th>
                <div className="flex flex-col items-center">
                  <span>Completed</span>
                  <div className="flex flex-row gap-2 justify-between w-full mt-1 px-4">
                    <div className="flex items-center gap-1">
                      <FaRegClock className="text-secondary fill-green-500" />
                      In Time
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRegClock className="text-secondary fill-red-500" />
                      Delayed
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {isFetched &&
              groupedByCategory.length > 0 &&
              groupedByCategory.map((item, index) => {
                const percent =
                  (item.obj.filter(task => task.status === 'Complete').length /
                    item.obj.length) *
                  100;
                const totalTasks = item.obj.length;
                const overdue = item.obj.filter(
                  task => task.status === 'Overdue'
                ).length;
                const pending = item.obj.filter(
                  task => task.status === 'Pending'
                ).length;
                const inProgress = item.obj.filter(
                  task => task.status === 'In Progress'
                ).length;
                const completed = item.obj.filter(
                  task => task.status === 'Complete'
                ).length;
                const completedInTime = item.obj
                  .filter(task => task.status === 'Complete')
                  .filter(
                    task => new Date(task.updatedOn) <= new Date(task.dueDate)
                  ).length;
                const completedDelayed = item.obj
                  .filter(task => task.status === 'Complete')
                  .filter(
                    task => new Date(task.updatedOn) > new Date(task.dueDate)
                  ).length;
                return (
                  <tr
                    key={index}
                    className="bg-white rounded-2xl shadow-md group cursor-pointer hover:bg-gray-100 transition duration-300"
                  >
                    <td className="p-4 flex items-center justify-start">
                      <div className="flex flex-row items-center justify-start gap-16 -lg:gap-2">
                        <div className="h-10 w-10">
                          <CircularProgressbar
                            value={percent}
                            text={`${percent.toFixed(0)}%`}
                            strokeWidth={8}
                            className="h-10 w-10"
                            styles={buildStyles({
                              backgroundColor: '#3e98c7',
                              textColor: 'black',
                              pathColor: '#6cf55f',
                              trailColor: '#fa7878',
                              textSize: '24px',
                            })}
                          />
                        </div>
                        <span>{item.category}</span>
                      </div>
                    </td>
                    <td>{totalTasks}</td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span>
                          {overdue + pending + inProgress} (
                          {(
                            ((overdue + pending + inProgress) / totalTasks) *
                            100
                          ).toFixed(0)}
                          %)
                        </span>
                        <div className="hidden group-hover:flex -md:flex flex-row gap-1 mt-2 justify-evenly">
                          <span className="text-red-500">
                            {overdue} (
                            {((overdue / totalTasks) * 100).toFixed(0)}
                            %)
                          </span>
                          <span className="text-yellow-500">
                            {pending} (
                            {((pending / totalTasks) * 100).toFixed(0)}
                            %)
                          </span>
                          <span className="text-orange-500">
                            {inProgress} (
                            {((inProgress / totalTasks) * 100).toFixed(0)}
                            %)
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <span>
                          {completed} (
                          {((completed / totalTasks) * 100).toFixed(0)}
                          %)
                        </span>
                        <div className="hidden group-hover:flex -md:flex mt-2 flex-row gap-2 justify-between w-full px-8">
                          <span className="text-green-500">
                            {completedInTime} (
                            {((completedInTime / totalTasks) * 100).toFixed(0)}
                            %)
                          </span>
                          <span className="text-red-500">
                            {completedDelayed} (
                            {((completedDelayed / totalTasks) * 100).toFixed(0)}
                            %)
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {groupedByCategory?.filter(item => item.status === activeTab)?.length >=
          10 && (
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
      {isFetched && groupedByCategory.length <= 0 && (
        <p className="font-semibold text-center mt-4 text-xl">
          No Tasks Found!
        </p>
      )}
    </>
  );
};

export default CateogryWiseTable;
