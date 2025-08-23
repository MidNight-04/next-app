'use client';
import React, { useMemo, useState, useEffect } from 'react';
import api from '../../../../lib/api';
import AsideContainer from '../../../../components/AsideContainer';
import { cn } from '../../../../lib/utils';
import { useRouter } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useAuthStore } from '../../../../store/useAuthStore';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../components/ui/tabs';
import { SearchOutlined } from '@mui/icons-material';
import { IoFilterOutline } from 'react-icons/io5';
import TaskFilterPopup from '../../../../components/filter/Filter';
import LoaderSpinner from '../../../../components/loader/LoaderSpinner';
import { FaCircleCheck, FaCircle } from 'react-icons/fa6';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaExclamationCircle } from 'react-icons/fa';
import { MdFilterListOff } from 'react-icons/md';
import TaskCard from '../../../../components/Task/TaskCard';
import Pagination from '../../../../components/Pagination/Pagination';

const Page = () => {
  const router = useRouter();
  const userType = useAuthStore(state => state.userType);
  const userId = useAuthStore(state => state.userId);
  const [activeFilter, setActiveFilter] = useState('This Week');
  const [activeTab, setActiveTab] = useState('Pending');
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilter, setOpenFilter] = useState(false);
  const [customFilters, setCustomFilters] = useState({
    selectedCategory: '',
    assignedBy: '',
    assignedTo: '',
    frequency: '',
    priority: '',
  });

  // search with tiny debounce to avoid too many calls
  const [rawSearch, setRawSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setSearchTerm(rawSearch.trim()), 350);
    return () => clearTimeout(t);
  }, [rawSearch]);

  // Filters shown at top
  const filters = [
    'Yesterday',
    'Today',
    'Tomorrow',
    'This Week',
    'This Month',
    'Last Month',
    'Next Week',
  ];

  // Fetch tasks
  const { data, isFetched, isError, isPreviousData, isFetching } = useQuery({
    queryKey: [
      'tasks',
      activeFilter,
      currentPage,
      customFilters,
      searchTerm,
      userType,
      userId,
    ],
    queryFn: async () => {
      const payload = {
        page: currentPage,
        userId,
        filter: activeFilter,
        ...customFilters,
      };

      // if searching, hit search endpoint; else use customfilters
      if (searchTerm) {
        // your backend search may also need filters; include if desired
        const res = await api.post(
          `/task/search/${encodeURIComponent(searchTerm)}`,
          payload
        );
        return res.data;
      }

      const response = await api.post(`/task/customfilters`, payload);
      return response.data;
    },
    keepPreviousData: true,
    placeholderData: keepPreviousData,
    retry: 1,
    retryDelay: 5000,
    staleTime: 10000,
  });

  // Normalize items list if API sometimes returns array or { items, hasMore }
  const { items, hasMore } = useMemo(() => {
    if (!data) return { items: [], hasMore: false };
    if (Array.isArray(data)) return { items: data, hasMore: data.length >= 10 }; // heuristic
    return {
      items: Array.isArray(data.items) ? data.items : [],
      hasMore: Boolean(data.hasMore),
    };
  }, [data]);

  const handleFilterChange = filterObj => {
    setCustomFilters(filterObj);
    setCurrentPage(1);
  };

  if (isFetching && !isFetched && !isError) {
    return <LoaderSpinner />;
  }

  const tabDefs = [
    {
      value: 'Overdue',
      label: 'Overdue',
      icon: <FaExclamationCircle className="text-secondary mr-1" />,
    },
    {
      value: 'Pending',
      label: 'Pending',
      icon: <FaCircle className="text-secondary mr-1" />,
    },
    {
      value: 'In Progress',
      label: 'In Progress',
      icon: <AiOutlineLoading3Quarters className="text-secondary mr-1" />,
    },
    {
      value: 'Complete',
      label: 'Completed',
      icon: <FaCircleCheck className="text-secondary mr-1" />,
    },
  ];

  return (
    <AsideContainer>
      <div>
        <div className="flex flex-row gap-2 w-full items-center my-4 justify-between">
          <h1 className="font-ubuntu font-bold text-[25px] leading-7 p-5 text-nowrap">
            My Task List
          </h1>
          <div className="relative w-72 ">
            <SearchOutlined
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-2xl border w-full border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              onChange={e => {
                setRawSearch(e.target.value.toLowerCase());
                setCurrentPage(1);
              }}
              value={rawSearch}
            />
          </div>
        </div>

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
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
              >
                {filter}
              </span>
            ))}

            <div className="flex flex-row gap-3">
              <button
                className={cn(
                  'flex flex-row items-center gap-2 bg-secondary text-primary px-3 py-2 rounded-3xl cursor-pointer'
                )}
                onClick={() => setOpenFilter(true)}
              >
                Filter
                <IoFilterOutline />
              </button>

              <button
                className={cn(
                  'flex flex-row items-center gap-2 bg-secondary text-primary px-3 py-2 rounded-3xl cursor-pointer',
                  Object.values(customFilters).every(v => v === '') && 'hidden'
                )}
                disabled={Object.values(customFilters).every(v => v === '')}
                onClick={() => {
                  setCustomFilters({
                    selectedCategory: '',
                    assignedBy: '',
                    assignedTo: '',
                    frequency: '',
                    priority: '',
                  });
                  setCurrentPage(1);
                }}
              >
                Clear
                <MdFilterListOff />
              </button>
            </div>
          </div>

          <div>
            <Tabs
              defaultValue="Pending"
              value={activeTab}
              onValueChange={value => {
                setActiveTab(value);
                setCurrentPage(1);
              }}
              className="flex flex-col w-full justify-center items-center my-4"
            >
              <TabsList className="grid grid-cols-4 -2xl:w-1/2 -lg:w-full">
                {tabDefs.map(t => (
                  <TabsTrigger key={t.value} value={t.value}>
                    {t.icon}
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {tabDefs.map(t => (
                <TabsContent key={t.value} value={t.value} className="w-full">
                  <div className="flex flex-col gap-4 w-full justify-center items-center my-4">
                    {isFetched &&
                      items.length > 0 &&
                      items
                        .filter(item => item.status === t.value)
                        .map(item => (
                          <TaskCard
                            key={item._id}
                            item={item}
                            onClick={() =>
                              router.push(`/admin/tasks/${item._id}`)
                            }
                          />
                        ))}
                  </div>

                  {items.filter(item => item.status === t.value).length >=
                    10 && (
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      isPreviousData={isPreviousData}
                      hasMore={hasMore}
                    />
                  )}
                </TabsContent>
              ))}

              {(!isFetched ||
                items.filter(i => i.status === activeTab).length < 1) && (
                <p
                  className="text-center text-secondary"
                  style={{ marginTop: '200px', fontSize: '18px' }}
                >
                  No Task Assign ...
                </p>
              )}
            </Tabs>
          </div>
        </div>
      </div>

      <TaskFilterPopup
        isOpen={openFilter}
        assgndBy={customFilters.assignedBy}
        assgndTo={customFilters.assignedTo}
        category={customFilters.selectedCategory}
        frqcy={customFilters.frequency}
        prty={customFilters.priority}
        filterhandler={handleFilterChange}
        onClose={() => setOpenFilter(false)}
        showBy={true}
      />
    </AsideContainer>
  );
};

export default Page;
