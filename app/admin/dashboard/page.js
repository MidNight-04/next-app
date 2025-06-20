'use client';
import React, { useEffect, useState } from 'react';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import axios from 'axios';
import 'react-circular-progressbar/dist/styles.css';
import AsideContainer from '../../../components/AsideContainer';
import { cn } from '../../../lib/utils';
import { useQuery, keepPreviousData, useQueries } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import LoaderSpinner from '../../../components/loader/LoaderSpinner';
import { MdFilterListOff } from 'react-icons/md';

const Page = () => {
  const userType = useAuthStore(state => state.userType);
  const userId = useAuthStore(state => state.userId);
  const [activeFilter, setActiveFilter] = useState('Today');
  const [activeTab, setActiveTab] = useState('Employee Wise');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [frequency, setFrequency] = useState('');
  const [working, setWorking] = useState('');
  const [mataval, setMatAval] = useState('');
  const [onTime, setOnTIme] = useState('');
  const [branch, setBranch] = useState('');

  useEffect(() => {
    if (userType !== 'ROLE_ADMIN') {
      setEmployeeId(userId);
    }
  }, []);

  // const user = userType !== 'ROLE_ADMIN' ? userId : null;
  const { data, isFetched, isError, isPreviousData, isFetching, refetch } =
    useQuery({
      queryKey: [
        'taskDashboard',
        activeFilter,
        currentPage,
        employeeId,
        siteId,
      ],
      queryFn: async () => {
        const response = await axios.post(
          `${process.env.REACT_APP_BASE_PATH}/api/task/customdashboardfilters`,
          {
            page: currentPage,
            assignedTo: employeeId,
            category: categoryId,
            repeat: frequency,
            filter: activeFilter,
            siteId: siteId,
            withComments: true,
          }
        );
        return response.data;
      },
      keepPreviousData: true,
      placeholderData: keepPreviousData,
      retry: 1,
      retryDelay: 5000,
      staleTime: 10000,
    });

  useEffect(() => {
    refetch();
  }, [employeeId, categoryId, frequency, refetch]);

  const [
    { data: teammembers },
    { data: siteIds, isFetched: siteFetched },
    { data: clients, isFetched: clientsFetched },
  ] = useQueries({
    queries: [
      {
        queryKey: ['teammembers'],
        queryFn: async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_PATH}/api/teammember/getall`
          );
          return response.data.data;
        },
      },
      {
        queryKey: ['siteIds'],
        queryFn: async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_PATH}/api/project/getallsiteids`
          );
          return response.data.data;
        },
      },
      {
        queryKey: ['clients'],
        queryFn: async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_PATH}/api/client/getall`
          );
          return response.data.data;
        },
      },
    ],
  });

  const filters = [
    'Yesterday',
    'Today',
    // 'This Week',
    // 'Last Week',
    'This Month',
    'Last Month',
    // 'This Year',
    // 'All Time',
  ];

  const searchTask = e => {
    const searchValue = e.target.value.toLowerCase();
    const data = axios.post(
      `${process.env.REACT_APP_BASE_PATH}/api/task/search/${searchValue}`
    );
    setTasks(data);
  };

  if (isFetching && !isError) {
    return <LoaderSpinner />;
  }

  const getMonthRange = (offset = 0, param = false) => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const end =
      offset !== 0
        ? new Date(today.getFullYear(), today.getMonth() + offset + 1, 0)
        : new Date(today);
    // const end = new Date(today)
    end.setHours(23, 59, 59, 999);
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
    if (param) {
      const days = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      return days;
    }
    return { start, end };
  };

  const getWeekRange = (offset = 0, param = false) => {
    const today = new Date();
    const currentDay = today.getDay();
    const start = new Date(today);
    start.setDate(today.getDate() - currentDay + offset * 7);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    if (param) {
      const days = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      return days;
    }
    return { start, end };
  };

  const getTodayRange = (offset = 0, param = false) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
    if (param) {
      const days = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      return days;
    }
    return { start, end };
  };

  const getYesterdayRange = (offset = 0, param = false) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    const end = new Date(yesterday);
    end.setHours(23, 59, 59, 999);
    yesterday.setDate(yesterday.getDate() + 1);
    end.setDate(end.getDate());
    return [yesterday];
  };

  const getYearRange = (offset = 0, param = false) => {
    const now = new Date();
    const year = now.getFullYear() + offset;
    const start = new Date(year, 3, 1, 0, 0, 0, 0);
    const end = new Date(now);
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() + 1);
    if (param) {
      const days = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
      }
      return days;
    }
    return { start, end };
  };
  const groupedByEmployeeMap = new Map();
  const groupedByCategoryMap = new Map();
  const groupedByCategoryAndUserIdMap = new Map();
  const groupedBySiteIdMap = new Map();

  if (isFetched && Array.isArray(data) && data.length > 0) {
    for (const task of data) {
      const activatedDate = new Date(task.activatedOn);
      const month = activatedDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      const date = activatedDate.toLocaleString('default', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
      const employee = task.issueMember.name;
      const category = task.category;
      const siteId = task.siteID;

      if (!groupedByEmployeeMap.has(employee)) {
        groupedByEmployeeMap.set(employee, []);
        groupedByEmployeeMap.get(employee).push(task);
      }

      if (!groupedByCategoryMap.has(category)) {
        groupedByCategoryMap.set(category, []);
        groupedByCategoryMap.get(category).push(task);
      }

      if (!groupedBySiteIdMap.has(siteId)) {
        groupedBySiteIdMap.set(siteId, []);
        groupedBySiteIdMap.get(siteId).push(task);
      }

      if (task.issueMember._id === userId) {
        if (!groupedByCategoryAndUserIdMap.has(category))
          groupedByCategoryAndUserIdMap.set(category, []);
        groupedByCategoryAndUserIdMap.get(category).push(task);
      }
    }
  }

  const groupedByEmployee = Array.from(
    groupedByEmployeeMap,
    ([employee, obj]) => ({ employee, obj })
  );

  // const groupedByEmployeeArray = Array.from(groupedByCategoryMap.values()).flatMap(tasks =>
  //   tasks.flatMap(task =>
  //     task.comments.map(comment => ({

  //       employee: {
  //         name: task.issueMember?.name,
  //         id: task.issueMember?._id,
  //       },
  //       siteID: task.siteID,
  //       stepName: task.stepName,
  //       description: task.description,
  //       createdAt: comment.createdAt,
  //       comment:comment.comment,
  //       siteDetails: comment.siteDetails,
  //     }))
  //   )
  // );

  const tasksArray = Array.from(groupedByCategoryMap.values()).flat();

  const groupCommentsByDate = tasks => {
    let daysInMonth;

    if (activeFilter === 'This Month') {
      daysInMonth = getMonthRange(0, true);
    }
    if (activeFilter === 'Last Month') {
      daysInMonth = getMonthRange(-1, true);
    }
    if (activeFilter === 'Today') {
      daysInMonth = getTodayRange(0, true);
    }
    if (activeFilter === 'Yesterday') {
      daysInMonth = getYesterdayRange(0, true);
    }
    if (activeFilter === 'This Week') {
      daysInMonth = getWeekRange(0, true);
    }
    if (activeFilter === 'Last Week') {
      daysInMonth = getWeekRange(-1, true);
    }
    if (activeFilter === 'This Year') {
      daysInMonth = getYearRange(0, true);
    }

    const allComments = tasks.flatMap(task =>
      task.comments
        .filter(comment => comment.type === 'In Progress')
        .map(comment => {
          console.log(task.issueMember?.name);
          return {
            _id: comment._id,
            taskId: comment.taskId,
            date: new Date(comment.createdAt),
            data: {
              employee: {
                name: task.issueMember?.name,
                id: task.issueMember?._id,
              },
              siteID: task.siteID,
              stepName: task.stepName,
              description: task.description,
              createdAt: comment.createdAt,
              comment: comment.comment,
              siteDetails: comment.siteDetails,
            },
          };
        })
    );

    const groupedByDate = {};
    for (const date of daysInMonth) {
      const dateKey = date.toISOString().split('T')[0];
      groupedByDate[dateKey] = [];

      for (const siteid of siteIds) {
        if (new Date(siteid.date) > new Date(date)) {
          break;
        }

        const data = allComments.filter(
          comment => comment.date?.toISOString?.().split('T')[0] === dateKey
        );

        if (!data.length) {
          const cmt = tasksArray
            .filter(task => task.siteID === siteid.siteID)
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          const lastItem = cmt[cmt.length - 1];
          groupedByDate[dateKey].push({
            date: dateKey,
            data: {
              employee: {
                name: lastItem?.issueMember?.name,
                id: lastItem?.issueMember?._id,
              },
              siteID: siteid.siteID,
              stepName: lastItem?.stepName,
              description: lastItem?.description || '',
              createdAt: dateKey,
              comment: '',
              siteDetails: {
                isWorking: 'NA',
                matetailAvailable: 'NA',
                workers: 'NA',
              },
            },
          });
        } else {
          groupedByDate[dateKey].push(...data);
        }
      }
    }

    // Ensure each date in the month has an entry
    const result = daysInMonth.map(day => {
      const dateStr = day.toISOString().split('T')[0];
      return groupedByDate[dateStr] || [{}];
    });

    return result;
  };

  let commentsByDate = [];

  if (siteFetched) {
    commentsByDate = groupCommentsByDate(tasksArray);
  }

  return (
    <AsideContainer>
      <div>
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 p-5 text-nowrap">
          Project Dashboard
        </h1>
        <div>
          <div className="flex flex-row items-center justify-center gap-2 -xl:flex-wrap">
            {filters.map(filter => (
              <span
                key={filter}
                className={cn(
                  'flex flex-row gap-2 py-[6px] text-nowrap px-3 bg-primary-foreground text-primary rounded-full border-[1px] border-primary [&_svg]:text-primary [&_svg]:text-2xl cursor-pointer',
                  activeFilter === filter
                    ? 'text-green-800 bg-green-200 border-green-800'
                    : ''
                )}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </span>
            ))}
          </div>
          <div className="flex flex-row items-center justify-center my-4 text-nowrap flex-wrap gap-2 [&>div]:w-32">
            <Select
              onValueChange={value => {
                setEmployeeId(value);
              }}
              value={employeeId}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                {teammembers?.map(item => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={value => {
                setSiteId(value);
              }}
              value={siteId}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Site ID" />
              </SelectTrigger>
              <SelectContent>
                {siteIds?.map(item => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.siteID}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={value => {
                setWorking(value);
              }}
              value={working}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Site Working" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={value => {
                setMatAval(value);
              }}
              value={mataval}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Material Available" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={value => {
                setOnTIme(value);
              }}
              value={onTime}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Updated Ontime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={value => {
                setBranch(value);
              }}
              value={branch}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gurgaon">Gurgaon</SelectItem>
                <SelectItem value="Ranchi">Ranchi</SelectItem>
                <SelectItem value="Patna">Patna</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                setEmployeeId('');
                setSiteId('');
                setMatAval('');
                setOnTIme('');
                setWorking('');
                setBranch('');
              }}
              className="flex items-center"
            >
              <span className="flex flex-row items-center gap-1 px-4 py-2 rounded-xl bg-secondary text-primary">
                <MdFilterListOff />
                Clear
              </span>
            </button>
          </div>
          <div className="w-full overflow-x-auto bg-secondary font-semibold rounded-2xl">
            <table className="w-full table-auto text-center text-nowrap">
              <thead>
                <tr className="text-primary">
                  <th className="py-4">Date & Time</th>
                  <th>Site Id</th>
                  <th>Step</th>
                  <th>Process</th>
                  <th>Issue Member</th>
                  <th>
                    <div className="flex items-center gap-1 justify-center">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                      Site Working
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center gap-1 w-full justify-center">
                      <span className="w-3 h-3 bg-cyan-500 rounded-full" />
                      No. of Workers
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center gap-1 justify-center">
                      <span className="w-3 h-3 bg-lime-500 rounded-full" />
                      Material Available
                    </div>
                  </th>
                  <th>Updated Ontime</th>
                </tr>
              </thead>
              <tbody>
                {isFetched &&
                  commentsByDate.length > 0 &&
                  commentsByDate
                    .flat()
                    .filter(item => {
                      if (working === 'yes') {
                        return item.data.siteDetails?.isWorking === true;
                      } else if (working === 'no') {
                        return (
                          item.data.siteDetails?.isWorking === false ||
                          item.data.siteDetails?.isWorking === 'NA'
                        );
                      } else {
                        return true;
                      }
                    })
                    .filter(item => {
                      if (mataval === 'yes') {
                        return (
                          item.data.siteDetails?.materialAvailable === true
                        );
                      } else if (mataval === 'no') {
                        return (
                          item.data.siteDetails?.materialAvailable === false ||
                          item.data.siteDetails?.materialAvailable === 'NA' ||
                          item.data.siteDetails?.materialAvailable === undefined
                        );
                      } else {
                        return true;
                      }
                    })
                    .filter(item => {
                      if (onTime === 'yes') {
                        return (
                          new Date(item.data.createdAt).getHours() < 11 &&
                          new Date(item.data.createdAt).getHours() !== 5 &&
                          new Date(item.data.createdAt).getMinutes() !== 30
                        );
                      } else if (onTime === 'no') {
                        return !(
                          new Date(item.data.createdAt).getHours() < 11 &&
                          new Date(item.data.createdAt).getHours() !== 5 &&
                          new Date(item.data.createdAt).getMinutes() !== 30
                        );
                      } else {
                        return true;
                      }
                    })
                    .filter(
                      item => item.data.branch === branch || branch === ''
                    )
                    .map((dt, idx) => {
                      return (
                        <tr
                          key={idx}
                          className="bg-white rounded-2xl shadow-md group cursor-pointer hover:bg-gray-100 transition duration-300"
                        >
                          <td className="py-4">
                            {new Date(dt.data.createdAt).toLocaleString(
                              'default',
                              {
                                // hour:"2-digit",
                                // minute:"2-digit",
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </td>
                          <td>{dt.data.siteID}</td>
                          <td>{dt.data.stepName}</td>
                          <td>{dt.data.description}</td>
                          <td>{dt.data.employee?.name}</td>
                          <td>
                            {dt.data.siteDetails?.isWorking === true
                              ? 'Yes'
                              : dt.data.siteDetails?.isWorking === false
                              ? 'No'
                              : 'NA'}
                          </td>
                          <td>{dt.data.siteDetails.workers || 'NA'}</td>
                          <td>
                            {dt.data.siteDetails.materialAvailable
                              ? dt.data.siteDetails.materialAvailable
                                ? 'Yes'
                                : 'No'
                              : 'NA'}
                          </td>
                          <td>
                            {new Date(dt.data.createdAt).getHours() < 11 &&
                            new Date(dt.data.createdAt).getHours() !== 5 &&
                            new Date(dt.data.createdAt).getMinutes() !== 30
                              ? 'Yes'
                              : 'Late'}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            {/* {groupedByDate?.filter(
                          item => item.status === activeTab
                        )?.length >= 10 && (
                          <div className="flex flex-row gap-2 items-center justify-center mt-4">
                            <button
                              onClick={() =>
                                setCurrentPage(prev => Math.max(prev - 1, 1))
                              }
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
                        )} */}
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default Page;
