'use client';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import api from '../../../../lib/api';
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
import { FaCheckCircle } from 'react-icons/fa';
import { FaRegClock } from 'react-icons/fa';
import { MdFilterListOff } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { SidebarTrigger } from '../../../../components/ui/sidebar';
import { Separator } from '../../../../components/ui/separator';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';

const EmployeeWiseTable = dynamic(() =>
  import('../../../../components/TaskDashboard/EmployeeWiseTable')
);
const MonthlyReportTable = dynamic(() =>
  import('../../../../components/TaskDashboard/MonthlyReportTable')
);
const CateogryWiseTable = dynamic(() =>
  import('../../../../components/TaskDashboard/CateogryWiseTable')
);
const DailyReportTable = dynamic(() =>
  import('../../../../components/TaskDashboard/DailyReportTable')
);
const OverdueReportTable = dynamic(() =>
  import('../../../../components/TaskDashboard/OverdueReportTable')
);
const MyReportTable = dynamic(() =>
  import('../../../../components/TaskDashboard/MyReportTable')
);

const FilterChipList = ({ filtersList, activeFilter, onSelect }) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 flex-wrap">
      {filtersList.map(filter => (
        <span
          key={filter}
          className={cn(
            'flex gap-2 py-[6px] px-3 bg-primary-foreground text-primary rounded-full border border-primary text-nowrap cursor-pointer',
            activeFilter === filter
              ? 'text-green-800 bg-green-200 border-green-800'
              : ''
          )}
          onClick={() => onSelect(filter)}
        >
          {filter}
        </span>
      ))}
    </div>
  );
};

const CountCard = ({
  color = 'text-gray-500',
  title,
  count,
  icon,
  bgColor = '',
  borderColor = '',
}) => (
  <div
    className={cn(
      'flex flex-col items-center px-4 py-2 border rounded-lg shadow text-center',
      color,
      borderColor,
      bgColor
    )}
  >
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
    <span className="text-2xl font-bold mt-1 text-black">{count}</span>
  </div>
);

const filtersList = [
  'Yesterday',
  'Today',
  'This Week',
  'Last Week',
  'This Month',
  'Last Month',
  'This Year',
  // 'All Time',
];

const getInitialFilterState = params => ({
  activeFilter: params.get('activeFilter') || 'Today',
  employeeId: params.get('employeeId') || '',
  siteId: params.get('siteId') || '',
  categoryId: params.get('categoryId') || '',
  frequency: params.get('frequency') || '',
  working: params.get('working') || '',
  mataval: params.get('mataval') || '',
  onTime: params.get('onTime') || '',
  branch: params.get('branch') || '',
});

function filterReducer(state, action) {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, [action.field]: action.value };
    case 'RESET_FILTERS':
      return {
        ...state,
        employeeId: '',
        siteId: '',
        categoryId: '',
        frequency: '',
        working: '',
        mataval: '',
        onTime: '',
        branch: '',
      };
    default:
      return state;
  }
}

const Content = () => {
  const userType = useAuthStore(state => state.userType);
  const userId = useAuthStore(state => state.userId);
  const [activeFilter, setActiveFilter] = useState('This Month');
  const [activeTab, setActiveTab] = useState('Employee Wise');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [frequency, setFrequency] = useState('');
  const [branch, setBranch] = useState('');
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [filters, dispatch] = useReducer(
    filterReducer,
    getInitialFilterState(params)
  );

  const debouncedUpdateUrl = useMemo(
    () =>
      debounce(filters => {
        const query = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) query.set(key, value);
        });
        router.replace(`${pathname}?${query.toString()}`);
      }, 400),
    [pathname, router]
  );

  useEffect(() => {
    if (userType === 'ROLE_SITE ENGINEER') {
      setEmployeeId(userId);
    }
  });

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
        const response = await api.post(
          `/task/customfilters`,
          // url,
          {
            page: currentPage,
            assignedTo: employeeId,
            category: categoryId,
            repeat: frequency,
            filter: activeFilter,
            branch: branch,
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
  }, [employeeId, categoryId, frequency, refetch, branch]);

  const [{ data: teammembers }, { data: categories }] = useQueries({
    queries: [
      {
        queryKey: ['teammembers'],
        queryFn: async () => {
          const response = await api.get(`/teammember/getall`);
          return response.data.data;
        },
      },
      {
        queryKey: ['categories'],
        queryFn: async () => {
          const response = await api.get(`/category/list`);
          return response.data.data;
        },
      },
    ],
  });

  const searchTask = e => {
    const searchValue = e.target.value.toLowerCase();
    const data = api.post(`/task/search/${searchValue}`);
    setTasks(data);
  };

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
      // const activatedDate = new Date(task.updatedOn);
      const activatedDate = new Date(task.updatedOn || task.updatedAt);
      const month = activatedDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      const date = activatedDate.toLocaleString('default', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      });
      const employee =
        task.issueMember?.firstname + ' ' + task.issueMember?.lastname;
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

      if (task.issueMember?._id === userId) {
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

  const getGroupedDataByTab = () => {
    switch (activeTab) {
      case 'Employee Wise':
      case 'Daily Report':
        return groupedByEmployee;
      case 'Monthly Report':
        return groupedByMonth;
      case 'My Report':
        return groupedByCategoryAndUserId;
      case 'Category Wise':
        return groupedByCategory;
      case 'OverDue Report':
        return groupedByOverdueByEmployee;
      default:
        return [];
    }
  };

  const statusCounts = useMemo(() => {
    const grouped = getGroupedDataByTab();
    const tasks = grouped.flatMap(item => item.obj);

    const completeTasks = tasks.filter(item => item.status === 'Complete');

    const inTimeCount = completeTasks.filter(
      task => new Date(task.updatedOn) <= new Date(task.dueDate)
    ).length;

    const delayedCount = completeTasks.length - inTimeCount;

    return {
      Overdue: tasks.filter(item => item.status === 'Overdue').length,
      Pending: tasks.filter(item => item.status === 'Pending').length,
      InProgress: tasks.filter(item => item.status === 'In Progress').length,
      Complete: completeTasks.length,
      InTime: inTimeCount,
      Delayed: delayedCount,
      CompleteTasks: completeTasks, // optionally keep full data
    };
  }, [
    activeTab,
    groupedByEmployee,
    groupedByMonth,
    groupedByCategoryAndUserId,
    groupedByCategory,
    groupedByOverdueByEmployee,
  ]);

  const tabComponents = {
    'Employee Wise': (
      <EmployeeWiseTable
        isFetched={isFetched}
        groupedByEmployee={groupedByEmployee}
        activeTab={activeTab}
      />
    ),
    'Monthly Report': (
      <MonthlyReportTable
        isFetched={isFetched}
        groupedByMonth={groupedByMonth}
        activeTab={activeTab}
      />
    ),
    'Daily Report': (
      <DailyReportTable
        isFetched={isFetched}
        groupedByDate={groupedByDate}
        activeTab={activeTab}
      />
    ),
    'My Report': (
      <MyReportTable
        isFetched={isFetched}
        groupedByCategoryAndUserId={groupedByCategoryAndUserId}
        activeTab={activeTab}
      />
    ),
    'Category Wise': (
      <CateogryWiseTable
        isFetched={isFetched}
        groupedByCategory={groupedByCategory}
        activeTab={activeTab}
      />
    ),
    'OverDue Report': (
      <OverdueReportTable
        isFetched={isFetched}
        groupedByOverdueByEmployee={groupedByOverdueByEmployee}
        activeTab={activeTab}
      />
    ),
  };

  if (isFetching && !isError) {
    return <LoaderSpinner />;
  }

  return (
    <AsideContainer>
      <div>
        <div className="flex w-full items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-2 hover:bg-primary" />
          <Separator
            orientation="vertical"
            className="data-[orientation=vertical]:h-4 bg-black"
          />
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 py-5 text-nowrap">
            Task Dashboard
          </h1>
        </div>
        <div>
          <FilterChipList
            filtersList={filtersList}
            activeFilter={filters.activeFilter}
            onSelect={value =>
              dispatch({ type: 'SET_FILTER', field: 'activeFilter', value })
            }
          />
          <div className="flex flex-row items-center justify-center my-4 text-nowrap flex-wrap gap-2 [&>div]:w-32">
            <CountCard
              title="Overdue"
              count={statusCounts.Overdue}
              icon={<span className="w-3 h-3 bg-red-500 rounded-full" />}
              color="text-red-500"
              borderColor="border-red-200"
              bgColor="bg-red-50"
            />
            <CountCard
              title="Pending"
              count={statusCounts.Pending}
              icon={
                <span className="w-3 h-3 border-2 border-yellow-500 rounded-full" />
              }
              color="text-yellow-500"
              borderColor="border-yellow-200"
              bgColor="bg-yellow-50"
            />
            <CountCard
              title="In Progress"
              count={statusCounts.InProgress}
              icon={
                <span className="w-3 h-3 bg-orange-500 rounded-full animate-spin" />
              }
              color="text-orange-500"
              borderColor="border-orange-200"
              bgColor="bg-orange-50"
            />
            <CountCard
              title="Completed"
              count={statusCounts.Complete}
              icon={<FaCheckCircle className="text-secondary fill-green-500" />}
              color="text-emerald-500"
              borderColor="border-emerald-200"
              bgColor="bg-emerald-50"
            />
            <CountCard
              title="In Time"
              count={statusCounts.InTime}
              icon={<FaRegClock className="text-secondary fill-green-500" />}
              color="text-green-500"
              borderColor="border-green-200"
              bgColor="bg-green-50"
            />
            <CountCard
              title="Delayed"
              count={statusCounts.Delayed}
              icon={<FaRegClock className="text-secondary fill-red-500" />}
              color="text-rose-500"
              borderColor="border-rose-200"
              bgColor="bg-rose-50"
            />
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
          <div>
            <Tabs
              defaultValue="Employee Wise"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full my-4"
            >
              <div className="flex justify-center items-center">
                <TabsList className="flex flex-wrap">
                  {Object.keys(tabComponents).map(tab => (
                    <TabsTrigger key={tab} value={tab}>
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <TabsContent value={activeTab} className="w-full">
                    {tabComponents[activeTab]}
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </div>
    </AsideContainer>
  );
};

export default Content;
