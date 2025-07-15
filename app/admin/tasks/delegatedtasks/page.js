'use client';

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Suspense,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../../../../lib/api';
import AsideContainer from '../../../../components/AsideContainer';
import TaskFilterPopup from '../../../../components/filter/Filter';
import TaskCardSkeleton from '../../../../components/skeletons/TaskCardSkeleton';
import PageHeaderSkeleton from '../../../../components/skeletons/HeaderSkeleton';
import TabsSkeleton from '../../../../components/skeletons/TabsSkeleton';
import TaskCard from '../../../../components/TaskCard';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../../../components/ui/tabs';
import { MdFilterListOff } from 'react-icons/md';
import { SearchOutlined } from '@mui/icons-material';
import { IoFilterOutline } from 'react-icons/io5';
import { cn } from '../../../../lib/utils';
import { useAuthStore } from '../../../../store/useAuthStore';
import { FaCircleCheck, FaCircle } from 'react-icons/fa6';
import { FaExclamationCircle } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { debounce } from 'lodash';

const tabValues = [
  { value: 'Overdue', icon: <FaExclamationCircle className="mr-1" /> },
  { value: 'Pending', icon: <FaCircle className="mr-1" /> },
  {
    value: 'In Progress',
    icon: <AiOutlineLoading3Quarters className="mr-1" />,
  },
  { value: 'Complete', icon: <FaCircleCheck className="mr-1" /> },
];

const filters = [
  'Yesterday',
  'Today',
  'Tomorrow',
  'This Week',
  'This Month',
  'Last Month',
  'Next Week',
];

const Content = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { userId, userType } = useAuthStore.getState();
  const user = userType !== 'ROLE_ADMIN' ? userId : null;

  const getParam = useCallback(
    (key, fallback = '') => searchParams.get(key) || fallback,
    [searchParams]
  );

  const [activeTab, setActiveTab] = useState(() => getParam('tab', 'Pending'));
  const [activeFilter, setActiveFilter] = useState(() =>
    getParam('filter', 'This Week')
  );
  const [customFilters, setCustomFilters] = useState({
    selectedCategory: getParam('selectedCategory'),
    assignedBy: getParam('assignedBy'),
    assignedTo: getParam('assignedTo'),
    frequency: getParam('frequency'),
    priority: getParam('priority'),
  });

  const [openFilter, setOpenFilter] = useState(false);

  const setUrlParams = useCallback(
    params => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value) newParams.set(key, value);
        else newParams.delete(key);
      });
      router.replace(`${pathname}?${newParams.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const {
    data,
    isFetching,
    isFetched,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['delegatedTasks', activeFilter, activeTab, customFilters],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await api.post(`/task/delegatedtasks`, {
        page: pageParam,
        userId: user,
        filter: activeFilter,
        ...customFilters,
      });
      return res.data;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage?.hasMore ? allPages.length + 1 : undefined,
  });

  const flatData = useMemo(
    () =>
      data?.pages?.flatMap(page =>
        page?.tasks?.filter(task => task.status === activeTab)
      ) || [],
    [data, activeTab]
  );

  const { ref: inViewRef, inView } = useInView({ threshold: 0.3 });

  const debouncedFetchNext = useMemo(
    () =>
      debounce(() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }, 300),
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    if (inView) debouncedFetchNext();
  }, [inView, debouncedFetchNext]);

  const handleTabChange = value => {
    setActiveTab(value);
    setUrlParams({ tab: value });
  };

  const handleFilterClick = filter => {
    setActiveFilter(filter);
    setUrlParams({ filter });
  };

  const handleCustomFilterChange = filter => {
    setCustomFilters(filter);
    setUrlParams(filter);
  };

  const handleClearFilters = () => {
    const cleared = {
      selectedCategory: '',
      assignedBy: '',
      assignedTo: '',
      frequency: '',
      priority: '',
    };
    setCustomFilters(cleared);
    setUrlParams(cleared);
  };

  useEffect(() => {
    refetch();
  }, [activeTab, activeFilter, customFilters, refetch]);

  if (isFetching && !isFetched) {
    return (
      <AsideContainer>
        <PageHeaderSkeleton />
        <TabsSkeleton />
        <div className="flex flex-col gap-4 w-full justify-center items-center my-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      </AsideContainer>
    );
  }

  return (
    <AsideContainer>
      <div>
        <div className="flex justify-between items-center my-4 px-5">
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 text-nowrap">
            Delegated Tasks
          </h1>
          <div className="relative w-72">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-2xl border w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-row flex-wrap gap-2 justify-center mb-4">
          {filters.map(filter => (
            <span
              key={filter}
              className={cn(
                'flex gap-2 py-[6px] px-3 bg-primary-foreground text-primary rounded-full border border-primary cursor-pointer',
                activeFilter === filter &&
                  'text-green-800 bg-green-200 border-green-800'
              )}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </span>
          ))}

          <button
            className="flex flex-row items-center gap-2 bg-secondary text-primary px-3 py-2 rounded-3xl"
            onClick={() => setOpenFilter(true)}
          >
            Filter <IoFilterOutline />
          </button>

          {!Object.values(customFilters).every(v => v === '') && (
            <button
              className="flex flex-row items-center gap-2 bg-secondary text-primary px-3 py-2 rounded-3xl"
              onClick={handleClearFilters}
            >
              Clear <MdFilterListOff />
            </button>
          )}
        </div>

        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={handleTabChange}
          className="flex flex-col w-full justify-center items-center my-4"
        >
          <TabsList className="grid grid-cols-4">
            {tabValues.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.icon} {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value={activeTab} className="w-full" key={activeTab}>
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col gap-4 w-full justify-center my-4">
                  {flatData.length > 0 ? (
                    flatData.map((item, i) => (
                      <div
                        key={item._id}
                        ref={i === flatData.length - 1 ? inViewRef : undefined}
                      >
                        <TaskCard
                          item={item}
                          onClick={() =>
                            router.push(`/admin/tasks/${item._id}`)
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-secondary mt-20 text-lg">
                      No Task Assigned...
                    </p>
                  )}

                  {isFetchingNextPage && <TaskCardSkeleton />}
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      <TaskFilterPopup
        isOpen={openFilter}
        assgndBy={customFilters.assignedBy}
        assgndTo={customFilters.assignedTo}
        category={customFilters.selectedCategory}
        frqcy={customFilters.frequency}
        prty={customFilters.priority}
        filterhandler={handleCustomFilterChange}
        onClose={() => setOpenFilter(false)}
        showTo={true}
        showBy={userType === 'ROLE_ADMIN'}
      />
    </AsideContainer>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <AsideContainer>
          <PageHeaderSkeleton />
          <TabsSkeleton />
        </AsideContainer>
      }
    >
      <Content />
    </Suspense>
  );
};

export default Page;
