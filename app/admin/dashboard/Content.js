'use client';

import React, { useReducer, useEffect, useMemo } from 'react';
import api from '../../../lib/api';
import AsideContainer from '../../../components/AsideContainer';
import { useQuery, keepPreviousData, useQueries } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/useAuthStore';
import LoaderSpinner from '../../../components/loader/LoaderSpinner';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import {
  getMonthRange,
  getWeekRange,
  getYearRange,
  getTodayRange,
  getYesterdayRange,
} from '../../../utils/dateUtils';
import FilterBar from '../../../components/ProjectDashboard/FilterBar';
import { useScrollRestore } from '../../../hooks/useScrollRestore';

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

const isOnTime = createdAt => {
  const date = new Date(createdAt);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return hours < 11 && hours !== 5 && minutes !== 30;
};

const groupCommentsByDate = (tasks, siteIds, filters) => {
  let days;

  switch (filters.activeFilter) {
    case 'This Month':
      days = getMonthRange(0, true);
      break;
    case 'Last Month':
      days = getMonthRange(-1, true);
      break;
    case 'Today':
      days = getTodayRange(0, true);
      break;
    case 'Yesterday':
      days = getYesterdayRange(0, true);
      break;
    case 'This Week':
      days = getWeekRange(0, true);
      break;
    case 'Last Week':
      days = getWeekRange(-1, true);
      break;
    case 'This Year':
      days = getYearRange(0, true);
      break;
    default:
      days = getTodayRange(0, true);
  }

  if (!Array.isArray(days)) days = [];

  const allComments = tasks?.flatMap(task => {
    const baseData = {
      employee: {
        name: `${task.issueMember?.firstname} ${task.issueMember?.lastname}`,
        id: task.issueMember?._id,
      },
      siteID: task.siteID,
      stepName: task.stepName,
      description: task.description,
      branch: task.branch,
      dueDate: task.dueDate,
    };

    if (task.comments.length > 0) {
      return task.comments
        .filter(comment => comment.type === 'In Progress')
        .map(comment => ({
          taskId: comment.taskId ?? task._id,
          ...baseData,
          createdAt: new Date(comment.createdAt),
          createdDateKey: new Date(comment.createdAt)
            .toISOString()
            .split('T')[0],
          siteDetails: comment.siteDetails,
        }));
    }

    return [
      {
        taskId: task._id,
        dueDate: task.dueDate,
        ...baseData,
        createdAt: new Date(task.createdAt || Date.now()),
        createdDateKey: new Date(task.createdAt || Date.now())
          .toISOString()
          .split('T')[0],
        siteDetails: {
          isWorking: 'NA',
          materialAvailable: 'NA',
          workers: 'NA',
        },
      },
    ];
  });

  const groupedByDate = {};
  for (const date of days) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const dateKey = nextDay.toISOString().split('T')[0];
    groupedByDate[dateKey] = [];

    // if (dateKey > new Date().toISOString().split('T')[0]) break;
    if (siteIds.length > 0) {
      for (const siteid of siteIds) {
        if (new Date(siteid.date) > new Date(date)) break;

        const siteComments = allComments?.filter(
          comment =>
            comment.createdDateKey === dateKey &&
            comment.siteID === siteid.siteID
        );

        if (siteComments?.length > 0) {
          groupedByDate[dateKey].push(...siteComments);
        } else {
          const taskForSite = tasks?.find(
            task => task.siteID === siteid.siteID
          );
          groupedByDate[dateKey].push({
            taskId: taskForSite?._id,
            employee: {
              name:
                taskForSite?.issueMember?.firstname +
                ' ' +
                taskForSite?.issueMember?.lastname,
              id: taskForSite?.issueMember?._id,
            },
            siteID: siteid.siteID,
            branch: siteid.branch,
            stepName: taskForSite?.stepName,
            description: taskForSite?.description,
            createdAt: dateKey,
            dueDate: taskForSite?.dueDate,
            comment: '',
            siteDetails: {
              isWorking: 'NA',
              materialAvailable: 'NA',
              workers: 'NA',
            },
          });
        }
      }
    }
  }

  return days
    .map(day => {
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);
      const dateStr = nextDay.toISOString().split('T')[0];
      return groupedByDate[dateStr] || [{}];
    })
    .flat();
};

const Dashboard = () => {
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { userType, userId } = useAuthStore.getState();

  const [filters, dispatch] = useReducer(
    filterReducer,
    getInitialFilterState(params)
  );

  useEffect(() => {
    if (userType !== 'ROLE_ADMIN') {
      dispatch({ type: 'SET_FILTER', field: 'employeeId', value: userId });
    }
  }, [userType, userId]);

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
    debouncedUpdateUrl(filters);
    return () => debouncedUpdateUrl.cancel();
  }, [filters, debouncedUpdateUrl]);

  const {
    data: tasksData = [],
    isFetched,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [
      'taskDashboard',
      filters.activeFilter,
      filters.employeeId,
      filters.siteId,
    ],
    queryFn: async () => {
      const response = await api.post(`task/dashboardfilter`, {
        page: 1,
        assignedTo: filters.employeeId,
        category: filters.categoryId,
        repeat: filters.frequency,
        filter: filters.activeFilter,
        siteId: filters.siteId,
        withComments: true,
      });
      return response.data;
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    retry: 1,
    retryDelay: 5000,
    staleTime: 10000,
  });

  const [{ data: teammembers }, { data: siteIds, isFetched: siteFetched }] =
    useQueries({
      queries: [
        {
          queryKey: ['teammembers'],
          queryFn: async () => (await api.get(`/teammember/getall`)).data.data,
        },
        {
          queryKey: ['siteIds'],
          queryFn: async () =>
            (await api.get(`/project/getallsiteids`)).data.data,
        },
      ],
    });

  const commentsByDate = useMemo(() => {
    if (!siteFetched && !isFetched) return [];
    return groupCommentsByDate(tasksData.tasks, siteIds, filters);
  }, [tasksData, siteIds, siteFetched, isFetched, filters]);

  const filteredRows = useMemo(() => {
    return commentsByDate
      .filter(item => {
        if (filters.working === 'yes')
          return item.siteDetails?.isWorking === true;
        if (filters.working === 'no')
          return (
            item.siteDetails?.isWorking === false ||
            item.siteDetails?.isWorking === 'NA'
          );
        return true;
      })
      .filter(item => {
        if (filters.mataval === 'yes')
          return item.siteDetails?.materialAvailable === true;
        if (filters.mataval === 'no')
          return (
            item.siteDetails?.materialAvailable === false ||
            item.siteDetails?.materialAvailable === 'NA' ||
            item.siteDetails?.materialAvailable === undefined
          );
        return true;
      })
      .filter(item => {
        if (filters.onTime === 'yes') return isOnTime(item.createdAt);
        if (filters.onTime === 'no') return !isOnTime(item.createdAt);
        return true;
      })
      .filter(item => filters.branch === '' || item.branch === filters.branch);
  }, [filters, commentsByDate]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'scrollRestoration' in window.history
    ) {
      const prevMode = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';

      return () => {
        window.history.scrollRestoration = prevMode;
      };
    }
  }, []);

  const allDataReady = isFetched && siteFetched;
  useScrollRestore(allDataReady);

  if (isFetching && !isError) return <LoaderSpinner />;

  return (
    <AsideContainer>
      <div>
        <h1 className="font-ubuntu font-bold text-[25px] leading-7 p-5">
          Project Dashboard
        </h1>
        <FilterBar
          filters={filters}
          dispatch={dispatch}
          teammembers={teammembers}
          siteIds={siteIds}
        />
        <div className="w-full overflow-x-auto bg-secondary font-semibold rounded-2xl">
          <table className="w-full table-auto text-center text-nowrap">
            <thead>
              <tr className="text-primary">
                <th className="py-4">Date</th>
                <th>Site Id</th>
                <th>Step</th>
                <th>Process</th>
                <th>
                  Issue
                  <br /> Member
                </th>
                <th>
                  <div className="flex items-center gap-1 justify-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                    Site
                    <br />
                    Working
                  </div>
                </th>
                <th>
                  <div className="flex items-center gap-1 justify-center">
                    <span className="w-3 h-3 bg-cyan-500 rounded-full" />
                    No. of <br />
                    Workers
                  </div>
                </th>
                <th>
                  <div className="flex items-center gap-1 justify-center">
                    <span className="w-3 h-3 bg-lime-500 rounded-full" />
                    Material
                    <br />
                    Available
                  </div>
                </th>
                <th>
                  Updated <br /> Ontime
                </th>
              </tr>
            </thead>
            <tbody>
              {allDataReady && filteredRows.length > 0 ? (
                filteredRows
                  .filter(dt => dt.taskId)
                  .map(dt => {
                    const dateObj = new Date(dt.createdAt);
                    const formattedDate = dateObj.toLocaleString('default', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    });
                    const isWorking = dt.siteDetails?.isWorking;
                    const workers = dt.siteDetails?.workers ?? 'NA';
                    const materialAvailable =
                      dt.siteDetails?.materialAvailable === true
                        ? 'Yes'
                        : dt.siteDetails?.materialAvailable === false
                        ? 'No'
                        : 'NA';

                    const onTimeStatus =
                      dateObj.getHours() < 11 &&
                      dateObj.getHours() !== 5 &&
                      dateObj.getMinutes() !== 30
                        ? 'Yes'
                        : 'Late';

                    return (
                      <tr
                        key={`${dt.taskId}-${dt.siteID}-${formattedDate}`}
                        className={`bg-white rounded-2xl shadow-md hover:bg-gray-100 transition duration-300 cursor-pointer ${
                          new Date(dt.dueDate) < new Date()
                            ? '!bg-red-600 text-white'
                            : ''
                        }`}
                        onClick={() => router.push(`/admin/tasks/${dt.taskId}`)}
                      >
                        <td className="py-4">{formattedDate}</td>
                        <td>{dt.siteID}</td>
                        <td>{dt.stepName}</td>
                        <td>{dt.description}</td>
                        <td className="max-w-32 truncate">
                          {dt.employee?.name || 'NA'}
                        </td>
                        <td>
                          {isWorking === true
                            ? 'Yes'
                            : isWorking === false
                            ? 'No'
                            : 'NA'}
                        </td>
                        <td>{workers}</td>
                        <td>{materialAvailable}</td>
                        <td>{onTimeStatus}</td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-white">
                    {allDataReady ? 'No records found' : 'Loading...'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AsideContainer>
  );
};

export default Dashboard;
