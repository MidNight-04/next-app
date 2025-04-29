'use client';
import React, { useEffect, useState } from 'react';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import AsideContainer from '../../../../components/AsideContainer';
import { cn } from '../../../../lib/utils';
import { useQuery, keepPreviousData, useQueries } from '@tanstack/react-query';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';
import { RiTeamFill } from 'react-icons/ri';
import { PiTagChevronFill } from 'react-icons/pi';
import { FaCheckCircle } from 'react-icons/fa';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { MdFilterListOff } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

const Page = () => {
  const userType = useAuthStore(state => state.userType);
  const userId = useAuthStore(state => state.userId);
  const [activeFilter, setActiveFilter] = useState('Today');
  const [activeTab, setActiveTab] = useState('Employee Wise');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [frequency, setFrequency] = useState('');

  let url;

  switch (activeFilter) {
    case 'Today':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/gettodaytaskbyid`;
      break;
    case 'Yesterday':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/getyesterdaytaskbyid`;
      break;
    case 'This Week':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/getthisweektaskbyid`;
      break;
    case 'Last Week':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/getlastweektaskbyid`;
      break;
    case 'This Month':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/getthismonthtaskbyid`;
      break;
    case 'Last Month':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/getlastmonthtaskbyid`;
      break;
    case 'This Year':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/getthisyeartaskbyid`;
      break;
    case 'Custom':
      url = `${process.env.REACT_APP_BASE_PATH}/api/task/customfilters`;
      break;
  }

  useEffect(()=>{ 
    if (userType !== 'ROLE_ADMIN') {
    setEmployeeId(userId);
  }
  },[])
  
  // const user = userType !== 'ROLE_ADMIN' ? userId : null;
  const { data, isFetched, isError, isPreviousData, isFetching, refetch } =
    useQuery({
      queryKey: [
        'taskDashboard',
        activeFilter,
        currentPage,
        employeeId,
        categoryId,
        frequency,
      ],
      queryFn: async () => {
        const response = await axios.post(url, {
          page: currentPage,
          assignedTo: employeeId,
          category: categoryId,
          repeat: frequency,
        });
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

  const [{ data: teammembers }, { data: categories }] = useQueries({
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
        queryKey: ['categories'],
        queryFn: async () => {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_PATH}/api/category/list`
          );
          return response.data.data;
        },
      },
    ],
  });

  const filters = [
    'Today',
    'Yesterday',
    'This Week',
    'Last Week',
    'This Month',
    'Last Month',
    'This Year',
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

  let overdueCount = 0;
  let pendingCount = 0;
  let inProgressCount = 0;
  let completeCount = 0;
  let inTimeCount = 0;
  let delayedCount = 0;

  const groupedByMonthMap = new Map();
  const groupedByDateMap = new Map();
  const groupedByEmployeeMap = new Map();
  const groupedByCategoryMap = new Map();
  const groupedByCategoryAndUserIdMap = new Map();
  const groupedByOverdueByEmployeeMap = new Map();

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
      const isOverdue = task.status === 'Overdue';

      switch (task.status) {
        case 'Overdue':
          overdueCount++;
          break;
        case 'Pending':
          pendingCount++;
          break;
        case 'In Progress':
          inProgressCount++;
          break;
        case 'Complete':
          completeCount++;
          if (new Date(task.updatedOn) <= new Date(task.dueDate)) {
            inTimeCount++;
          } else {
            delayedCount++;
          }
          break;
      }

      if (!groupedByMonthMap.has(month)) groupedByMonthMap.set(month, []);
      groupedByMonthMap.get(month).push(task);

      if (!groupedByDateMap.has(date)) groupedByDateMap.set(date, []);
      groupedByDateMap.get(date).push(task);

      if (!groupedByEmployeeMap.has(employee))
        groupedByEmployeeMap.set(employee, []);
      groupedByEmployeeMap.get(employee).push(task);

      if (!groupedByCategoryMap.has(category))
        groupedByCategoryMap.set(category, []);
      groupedByCategoryMap.get(category).push(task);

      if (task.issueMember._id === userId) {
        if (!groupedByCategoryAndUserIdMap.has(category))
          groupedByCategoryAndUserIdMap.set(category, []);
        groupedByCategoryAndUserIdMap.get(category).push(task);
      }

      const overdueKey = `${employee}`;
      if (!groupedByOverdueByEmployeeMap.has(overdueKey))
        groupedByOverdueByEmployeeMap.set(overdueKey, []);
      groupedByOverdueByEmployeeMap.get(overdueKey).push(task);
    }
  }

  const groupedByMonth = Array.from(groupedByMonthMap, ([month, obj]) => ({
    month,
    obj,
  }));
  const groupedByDate = Array.from(groupedByDateMap, ([date, obj]) => ({
    date,
    obj,
  }));
  const groupedByEmployee = Array.from(
    groupedByEmployeeMap,
    ([employee, obj]) => ({ employee, obj })
  );
  const groupedByCategory = Array.from(
    groupedByCategoryMap,
    ([category, obj]) => ({ category, obj })
  );
  const groupedByCategoryAndUserId = Array.from(
    groupedByCategoryAndUserIdMap,
    ([category, obj]) => ({ category, userId, obj })
  );
  const groupedByOverdueByEmployee = Array.from(
    groupedByOverdueByEmployeeMap,
    ([key, obj]) => {
      const [employee, overdue] = key.split('-');
      return { employee, overdue: overdue === 'true', obj };
    }
  );

  const getOverdueCount = () => {
    switch (activeTab) {
      case 'Employee Wise':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Overdue').length;
      case 'Monthly Report':
        return groupedByMonth
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Overdue').length;
      case 'Daily Report':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Overdue').length;
      case 'My Report':
        return groupedByCategoryAndUserId
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Overdue').length;
      case 'Category Wise':
        return groupedByCategory
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Overdue').length;
      case 'OverDue Report':
        return groupedByOverdueByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Overdue').length;
      default:
        return 0;
    }
  };
  const getPendingCount = () => {
    switch (activeTab) {
      case 'Employee Wise':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Pending').length;
      case 'Monthly Report':
        return groupedByMonth
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Pending').length;
      case 'Daily Report':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Pending').length;
      case 'My Report':
        return groupedByCategoryAndUserId
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Pending').length;
      case 'Category Wise':
        return groupedByCategory
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Pending').length;
      case 'OverDue Report':
        return groupedByOverdueByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Pending').length;
      default:
        return 0;
    }
  };
  const getInProgressCount = () => {
    switch (activeTab) {
      case 'Employee Wise':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'In Progress').length;
      case 'Monthly Report':
        return groupedByMonth
          .flatMap(item => item.obj)
          .filter(item => item.status === 'In Progress').length;
      case 'Daily Report':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'In Progress').length;
      case 'My Report':
        return groupedByCategoryAndUserId
          .flatMap(item => item.obj)
          .filter(item => item.status === 'In Progress').length;
      case 'Category Wise':
        return groupedByCategory
          .flatMap(item => item.obj)
          .filter(item => item.status === 'In Progress').length;
      case 'OverDue Report':
        return groupedByOverdueByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'In Progress').length;
      default:
        return 0;
    }
  };
  const getCompleteCount = () => {
    switch (activeTab) {
      case 'Employee Wise':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Complete');
      case 'Monthly Report':
        return groupedByMonth
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Complete');
      case 'Daily Report':
        return groupedByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Complete');
      case 'My Report':
        return groupedByCategoryAndUserId
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Complete');
      case 'Category Wise':
        return groupedByCategory
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Complete');
      case 'OverDue Report':
        return groupedByOverdueByEmployee
          .flatMap(item => item.obj)
          .filter(item => item.status === 'Complete');
      default:
        return 0;
    }
  };

  return (
    <AsideContainer>
      <div>
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 p-5 text-nowrap">
          Task Dashboard
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
            <div className="flex flex-col items-center px-4 py-2 border rounded-lg shadow text-red-500 border-red-200 bg-red-50">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
              <span className="text-2xl font-bold mt-1 text-black">
                {getOverdueCount()}
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 border rounded-lg shadow text-yellow-500 border-yellow-200 bg-yellow-50">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 border-2 border-yellow-500 rounded-full" />
                <span className="text-sm font-medium">Pending</span>
              </div>
              <span className="text-2xl font-bold mt-1 text-black">
                {getPendingCount()}
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 border rounded-lg shadow text-orange-500 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-spin" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
              <span className="text-2xl font-bold mt-1 text-black">
                {getInProgressCount()}
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 border rounded-lg shadow text-emerald-500 border-emerald-200 bg-emerald-50">
              <div className="flex items-center gap-1">
                <FaCheckCircle className="text-secondary fill-green-500" />
                <span className="text-sm font-medium">Completed</span>
              </div>
              <span className="text-2xl font-bold mt-1 text-black">
                {getCompleteCount().length}
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 border rounded-lg shadow text-green-500 border-green-200 bg-green-50">
              <div className="flex items-center gap-1">
                <FaRegClock className="text-secondary fill-green-500" />
                <span className="text-sm font-medium ">In Time</span>
              </div>
              <span className="text-2xl font-bold mt-1 text-black">
                {getCompleteCount()
                  ?.filter(item => item.status === 'Complete')
                  .filter(
                    item => new Date(item.updatedOn) <= new Date(item.dueDate)
                  ).length || 0}
              </span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 border rounded-lg shadow text-rose-500 border-rose-200 bg-rose-50">
              <div className="flex items-center gap-1">
                <FaRegClock className="text-secondary fill-red-500" />
                <span className="text-sm font-medium">Delayed</span>
              </div>
              <span className="text-2xl font-bold mt-1 text-black">
                {getCompleteCount()?.filter(
                  item =>
                    item.status === 'Complete' &&
                    new Date(item.updatedOn) >= new Date(item.dueDate)
                ).length || 0}
              </span>
            </div>
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
                setCategoryId(value);
              }}
              value={categoryId}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Project">Project</SelectItem>
                {categories?.map(item => (
                  <SelectItem key={item._id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={value => {
                setFrequency(value);
              }}
              value={frequency}
            >
              <SelectTrigger className="w-[180px] bg-white px-2 py-1 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="norepeat">No Repeat</SelectItem>
                <SelectItem value="Hourly">Hourly</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <button
              onClick={() => {
                setEmployeeId('');
                setCategoryId('');
                setFrequency('');
              }}
              className="flex items-center"
            >
              <span className="flex flex-row items-center gap-1 px-4 py-2 rounded-xl bg-secondary text-primary">
                <MdFilterListOff />
                Clear
              </span>
            </button>
          </div>
          <div>
            <Tabs
              defaultValue="Employee Wise"
              value={activeTab}
              onValueChange={value => setActiveTab(value)}
              className="flex flex-col w-full justify-center items-center my-4"
            >
              <TabsList className="flex flex-row flex-wrap">
                <TabsTrigger value="Employee Wise">
                  <RiTeamFill className="text-secondary mr-1" />
                  Employee Wise
                </TabsTrigger>
                <TabsTrigger value="Category Wise">
                  <PiTagChevronFill className="text-secondary mr-1" />
                  Category Wise
                </TabsTrigger>
                <TabsTrigger value="My Report">
                  <PiTagChevronFill className="text-secondary mr-1" />
                  My Report
                </TabsTrigger>
                <TabsTrigger value="Monthly Report">
                  <IoCalendarClearOutline className="text-secondary mr-1" />
                  Monthly Report
                </TabsTrigger>
                <TabsTrigger value="Daily Report">
                  <FaRegCalendarAlt className="text-secondary mr-1" />
                  Daily Report
                </TabsTrigger>
                <TabsTrigger value="OverDue Report">
                  <FaRegClock className="text-secondary mr-1" />
                  OverDue Report
                </TabsTrigger>
              </TabsList>
              <AnimatePresence mode="wait">
                {activeTab === 'Employee Wise' && (
                  <motion.div
                    key="Employee Wise"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TabsContent
                      value="Employee Wise"
                      className="w-full text-nowrap"
                    >
                      <div className="w-full overflow-x-auto bg-secondary font-semibold rounded-2xl">
                        <table className="w-full table-auto text-center">
                          <thead>
                            <tr className="text-primary">
                              <th className="p-4">Employee Name</th>
                              <th className="px-4">Total</th>
                              <th>
                                <div className="flex flex-col items-center px-4">
                                  <span>Not Completed</span>
                                  <div className="flex gap-2 mt-1 flex-row justify-evenly w-full">
                                    <div className="flex items-center gap-1">
                                      <span className="w-3 h-3 bg-red-500 rounded-full" />
                                      Overdue
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="w-3 h-3 border-2 border-yellow-500 rounded-full" />
                                      Pending
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="w-3 h-3 bg-orange-500 rounded-full animate-spin" />
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
                              groupedByEmployee.length > 0 &&
                              groupedByEmployee.map((item, index) => {
                                const percent =
                                  (item.obj.filter(
                                    task => task.status === 'Complete'
                                  ).length /
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
                                    task =>
                                      new Date(task.updatedOn) <=
                                      new Date(task.dueDate)
                                  ).length;
                                const completedDelayed = item.obj
                                  .filter(task => task.status === 'Complete')
                                  .filter(
                                    task =>
                                      new Date(task.updatedOn) >
                                      new Date(task.dueDate)
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
                                        <span>{item.employee}</span>
                                      </div>
                                    </td>
                                    <td>{totalTasks}</td>
                                    <td>
                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {overdue + pending + inProgress} (
                                          {(
                                            ((overdue + pending + inProgress) /
                                              totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex flex-row gap-1 mt-2 justify-evenly">
                                          <span className="text-red-500">
                                            {overdue} (
                                            {(
                                              (overdue / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-yellow-500">
                                            {pending} (
                                            {(
                                              (pending / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-orange-500">
                                            {inProgress} (
                                            {(
                                              (inProgress / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {completed} (
                                          {(
                                            (completed / totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex mt-2 flex-row gap-2 justify-between w-full px-8">
                                          <span className="text-green-500">
                                            {completedInTime} (
                                            {(
                                              (completedInTime / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-red-500">
                                            {completedDelayed} (
                                            {(
                                              (completedDelayed / totalTasks) *
                                              100
                                            ).toFixed(0)}
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
                        {groupedByDate?.filter(
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
                        )}
                      </div>
                      {isFetched && groupedByEmployee.length <= 0 && (
                        <p className="font-semibold text-center mt-4 text-xl">
                          No Tasks Found!
                        </p>
                      )}
                    </TabsContent>
                  </motion.div>
                )}
                {activeTab === 'Monthly Report' && (
                  <motion.div
                    key="Monthly Report"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TabsContent
                      value="Monthly Report"
                      className="w-full text-nowrap"
                    >
                      <div className="w-full overflow-x-auto bg-secondary font-semibold rounded-2xl">
                        <table className="w-full table-auto text-center">
                          <thead>
                            <tr className="text-primary">
                              <th className="p-4">Month</th>
                              <th className="px-4">Total</th>
                              <th>
                                <div className="flex flex-col items-center justify-between px-4">
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
                              groupedByMonth.length > 0 &&
                              groupedByMonth
                                .map(item => {
                                  if (selectedTeam.length > 0) {
                                    const filteredTasks = item.obj.filter(
                                      task =>
                                        selectedTeam.includes(
                                          task.issueMember?._id
                                        )
                                    );
                                    return {
                                      ...item,
                                      obj: filteredTasks,
                                    };
                                  }
                                  return item;
                                })
                                .map((item, index) => {
                                  const percent =
                                    (item.obj.filter(
                                      task => task.status === 'Complete'
                                    ).length /
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
                                      task =>
                                        new Date(task.updatedOn) <=
                                        new Date(task.dueDate)
                                    ).length;
                                  const completedDelayed = item.obj
                                    .filter(task => task.status === 'Complete')
                                    .filter(
                                      task =>
                                        new Date(task.updatedOn) >
                                        new Date(task.dueDate)
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
                                          <span>{item.month}</span>
                                        </div>
                                      </td>
                                      <td>{totalTasks}</td>
                                      <td>
                                        <div className="flex flex-col gap-1 ">
                                          <span>
                                            {overdue + pending + inProgress} (
                                            {(
                                              ((overdue +
                                                pending +
                                                inProgress) /
                                                totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <div className="hidden group-hover:flex -md:flex flex-row gap-1 mt-2 justify-evenly ">
                                            <span className="text-red-500">
                                              {overdue} (
                                              {(
                                                (overdue / totalTasks) *
                                                100
                                              ).toFixed(0)}
                                              %)
                                            </span>
                                            <span className="text-yellow-500">
                                              {pending} (
                                              {(
                                                (pending / totalTasks) *
                                                100
                                              ).toFixed(0)}
                                              %)
                                            </span>
                                            <span className="text-orange-500">
                                              {inProgress} (
                                              {(
                                                (inProgress / totalTasks) *
                                                100
                                              ).toFixed(0)}
                                              %)
                                            </span>
                                          </div>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="flex flex-col gap-1">
                                          <span>
                                            {completed} (
                                            {(
                                              (completed / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <div className="hidden group-hover:flex -md:flex mt-2 flex-row gap-2 justify-between w-full px-8">
                                            <span className="text-green-500">
                                              {completedInTime} (
                                              {(
                                                (completedInTime / totalTasks) *
                                                100
                                              ).toFixed(0)}
                                              %)
                                            </span>
                                            <span className="text-red-500">
                                              {completedDelayed} (
                                              {(
                                                (completedDelayed /
                                                  totalTasks) *
                                                100
                                              ).toFixed(0)}
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

                        {groupedByMonth?.filter(
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
                        )}
                      </div>
                    </TabsContent>
                    {isFetched && groupedByMonth.length <= 0 && (
                      <p className="font-semibold text-center mt-4 text-xl">
                        No Tasks Found!
                      </p>
                    )}
                  </motion.div>
                )}
                {activeTab === 'Daily Report' && (
                  <motion.div
                    key="Daily Report"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TabsContent
                      value="Daily Report"
                      className="w-full text-nowrap"
                    >
                      <div className="w-full overflow-x-auto bg-secondary font-semibold rounded-2xl">
                        <table className="w-full table-auto text-center">
                          <thead>
                            <tr className="text-primary">
                              <th className="p-4">Date</th>
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
                              groupedByDate.length > 0 &&
                              groupedByDate.map((item, index) => {
                                const percent =
                                  (item.obj.filter(
                                    task => task.status === 'Complete'
                                  ).length /
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
                                    task =>
                                      new Date(task.updatedOn) <=
                                      new Date(task.dueDate)
                                  ).length;
                                const completedDelayed = item.obj
                                  .filter(task => task.status === 'Complete')
                                  .filter(
                                    task =>
                                      new Date(task.updatedOn) >
                                      new Date(task.dueDate)
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
                                        <span>{item.date}</span>
                                      </div>
                                    </td>
                                    <td>{totalTasks}</td>
                                    <td>
                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {overdue + pending + inProgress} (
                                          {(
                                            ((overdue + pending + inProgress) /
                                              totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex flex-row gap-1 mt-2 justify-evenly">
                                          <span className="text-red-500">
                                            {overdue} (
                                            {(
                                              (overdue / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-yellow-500">
                                            {pending} (
                                            {(
                                              (pending / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-orange-500">
                                            {inProgress} (
                                            {(
                                              (inProgress / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {completed} (
                                          {(
                                            (completed / totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex mt-2 flex-row gap-2 justify-between w-full px-8">
                                          <span className="text-green-500">
                                            {completedInTime} (
                                            {(
                                              (completedInTime / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-red-500">
                                            {completedDelayed} (
                                            {(
                                              (completedDelayed / totalTasks) *
                                              100
                                            ).toFixed(0)}
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

                        {groupedByDate?.filter(
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
                        )}
                      </div>
                      {isFetched && groupedByDate.length <= 0 && (
                        <p className="font-semibold text-center mt-4 text-xl">
                          No Tasks Found!
                        </p>
                      )}
                    </TabsContent>
                  </motion.div>
                )}
                {activeTab === 'My Report' && (
                  <motion.div
                    key="My Report"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TabsContent
                      value="My Report"
                      className="w-full text-nowrap"
                    >
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
                              groupedByCategoryAndUserId.length > 0 &&
                              groupedByCategoryAndUserId.map((item, index) => {
                                const percent =
                                  (item.obj.filter(
                                    task => task.status === 'Complete'
                                  ).length /
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
                                    task =>
                                      new Date(task.updatedOn) <=
                                      new Date(task.dueDate)
                                  ).length;
                                const completedDelayed = item.obj
                                  .filter(task => task.status === 'Complete')
                                  .filter(
                                    task =>
                                      new Date(task.updatedOn) >
                                      new Date(task.dueDate)
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
                                            ((overdue + pending + inProgress) /
                                              totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex flex-row gap-1 mt-2 justify-evenly">
                                          <span className="text-red-500">
                                            {overdue} (
                                            {(
                                              (overdue / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-yellow-500">
                                            {pending} (
                                            {(
                                              (pending / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-orange-500">
                                            {inProgress} (
                                            {(
                                              (inProgress / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {completed} (
                                          {(
                                            (completed / totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex mt-2 flex-row gap-2 justify-between w-full px-8">
                                          <span className="text-green-500">
                                            {completedInTime} (
                                            {(
                                              (completedInTime / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-red-500">
                                            {completedDelayed} (
                                            {(
                                              (completedDelayed / totalTasks) *
                                              100
                                            ).toFixed(0)}
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

                        {groupedByCategory?.filter(
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
                        )}
                      </div>
                      {isFetched && groupedByCategoryAndUserId.length <= 0 && (
                        <p className="font-semibold text-center mt-4 text-xl">
                          No Tasks Found!
                        </p>
                      )}
                    </TabsContent>
                  </motion.div>
                )}
                {activeTab === 'Category Wise' && (
                  <motion.div
                    key="Category Wise"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TabsContent
                      value="Category Wise"
                      className="w-full text-nowrap"
                    >
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
                                  (item.obj.filter(
                                    task => task.status === 'Complete'
                                  ).length /
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
                                    task =>
                                      new Date(task.updatedOn) <=
                                      new Date(task.dueDate)
                                  ).length;
                                const completedDelayed = item.obj
                                  .filter(task => task.status === 'Complete')
                                  .filter(
                                    task =>
                                      new Date(task.updatedOn) >
                                      new Date(task.dueDate)
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
                                            ((overdue + pending + inProgress) /
                                              totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex flex-row gap-1 mt-2 justify-evenly">
                                          <span className="text-red-500">
                                            {overdue} (
                                            {(
                                              (overdue / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-yellow-500">
                                            {pending} (
                                            {(
                                              (pending / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-orange-500">
                                            {inProgress} (
                                            {(
                                              (inProgress / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex flex-col gap-1">
                                        <span>
                                          {completed} (
                                          {(
                                            (completed / totalTasks) *
                                            100
                                          ).toFixed(0)}
                                          %)
                                        </span>
                                        <div className="hidden group-hover:flex -md:flex mt-2 flex-row gap-2 justify-between w-full px-8">
                                          <span className="text-green-500">
                                            {completedInTime} (
                                            {(
                                              (completedInTime / totalTasks) *
                                              100
                                            ).toFixed(0)}
                                            %)
                                          </span>
                                          <span className="text-red-500">
                                            {completedDelayed} (
                                            {(
                                              (completedDelayed / totalTasks) *
                                              100
                                            ).toFixed(0)}
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

                        {groupedByCategory?.filter(
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
                        )}
                      </div>
                      {isFetched && groupedByCategory.length <= 0 && (
                        <p className="font-semibold text-center mt-4 text-xl">
                          No Tasks Found!
                        </p>
                      )}
                    </TabsContent>
                  </motion.div>
                )}
                {activeTab === 'OverDue Report' && (
                  <motion.div
                    key="OverDue Report"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <TabsContent
                      value="OverDue Report"
                      className="w-full text-nowrap"
                    >
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
                                  console.log(item);
                                  const overdueDate = new Date(task.dueDate);
                                  const overdueAcc = new Date(acc.dueDate);
                                  return overdueDate < overdueAcc ? task : acc;
                                }, item.obj[0]);
                                const date = Math.abs(
                                  new Date(taskObj.dueDate).getDate() -
                                    new Date().getDate()
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

                        {groupedByOverdueByEmployee?.filter(
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
                        )}
                      </div>
                      {isFetched && groupedByOverdueByEmployee.length <= 0 && (
                        <p className="font-semibold text-center mt-4 text-xl">
                          No Tasks Found!
                        </p>
                      )}
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default Page;
